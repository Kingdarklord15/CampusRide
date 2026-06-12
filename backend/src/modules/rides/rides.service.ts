import type { PrismaClient, RideStatus } from "@prisma/client";
import type { AuthUser } from "../../middleware/auth.middleware.js";
import { badRequest, forbidden, notFound } from "../../utils/errors.js";

const transitions: Record<RideStatus, RideStatus[]> = {
  REQUESTED: ["ACCEPTED", "CANCELLED", "REJECTED"],
  ACCEPTED: ["DRIVER_ARRIVING", "CANCELLED"],
  DRIVER_ARRIVING: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
  REJECTED: []
};

export class RidesService {
  constructor(private readonly prisma: PrismaClient) { }

  async list(actor: AuthUser) {
    if (actor.role === "ADMIN") {
      return this.prisma.ride.findMany({ include: this.include(), orderBy: { requestedAt: "desc" } });
    }
    if (actor.role === "PASSENGER") {
      const passenger = await this.prisma.passengerProfile.findUnique({ where: { userId: actor.id } });
      if (!passenger) throw notFound("Passenger profile not found");
      return this.prisma.ride.findMany({ where: { passengerProfileId: passenger.id }, include: this.include(), orderBy: { requestedAt: "desc" } });
    }
    const driver = await this.prisma.driverProfile.findUnique({
      where: { userId: actor.id }
    });

    if (!driver) throw notFound("Driver profile not found");

    return this.prisma.ride.findMany({
      where: {
        OR: [
          {
            status: "REQUESTED"
          },
          {
            driverProfileId: driver.id
          }
        ]
      },
      include: this.include(),
      orderBy: {
        requestedAt: "desc"
      }
    });
  }

  getById(rideId: string) {
    return this.prisma.ride.findUniqueOrThrow({ where: { id: rideId }, include: this.include() });
  }

  async create(
    userId: string,
    data: {
      pickupLocation: string;
      pickupLatitude?: number;
      pickupLongitude?: number;
      dropoffLocation: string;
      dropoffLatitude?: number;
      dropoffLongitude?: number;
      fareAmount?: number;
      distanceKm?: number;
    }
  ) {
    const passenger = await this.prisma.passengerProfile.findUnique({ where: { userId } });
    if (!passenger) throw notFound("Passenger profile not found");
    const ride = await this.prisma.$transaction(async (tx) => {
      const ride = await tx.ride.create({ data: { ...data, passengerProfileId: passenger.id }, include: this.include() });
      await tx.rideStatusHistory.create({ data: { rideId: ride.id, status: "REQUESTED", changedByUserId: userId } });
      return ride;
    });
    this.notifyStatusChange(ride);
    return ride;
  }

  async assignDriver(actor: AuthUser, rideId: string, driverProfileId: string) {
    if (actor.role !== "ADMIN") throw forbidden();
    return this.transition(rideId, "ACCEPTED", actor.id, { driverProfileId, acceptedAt: new Date() });
  }

  async accept(actor: AuthUser, rideId: string) {
    const driver = await this.requireDriver(actor.id);
    return this.transition(rideId, "ACCEPTED", actor.id, { driverProfileId: driver.id, acceptedAt: new Date() });
  }

  async reject(actor: AuthUser, rideId: string) {
    await this.requireDriver(actor.id);
    return this.transition(rideId, "REJECTED", actor.id);
  }

  async cancel(actor: AuthUser, rideId: string, reason?: string) {
    return this.transition(rideId, "CANCELLED", actor.id, { cancelledAt: new Date(), cancellationReason: reason });
  }

  async arriving(actor: AuthUser, rideId: string) {
    return this.transition(rideId, "DRIVER_ARRIVING", actor.id);
  }

  async start(actor: AuthUser, rideId: string) {
    return this.transition(rideId, "IN_PROGRESS", actor.id, { startedAt: new Date() });
  }

  async complete(actor: AuthUser, rideId: string) {
    const completed = await this.prisma.$transaction(async (tx) => {
      const ride = await tx.ride.findUnique({ where: { id: rideId } });
      if (!ride) throw notFound("Ride not found");
      this.ensureTransition(ride.status, "COMPLETED");
      const completed = await tx.ride.update({
        where: { id: rideId },
        data: { status: "COMPLETED", completedAt: new Date() },
        include: this.include()
      });
      await tx.rideStatusHistory.create({ data: { rideId, status: "COMPLETED", changedByUserId: actor.id } });
      if (ride.driverProfileId) {
        await tx.driverProfile.update({
          where: { id: ride.driverProfileId },
          data: { status: "ONLINE", totalRides: { increment: 1 }, totalEarnings: { increment: ride.fareAmount ?? 0 } }
        });
      }
      return completed;
    });
    this.notifyStatusChange(completed);
    return completed;
  }

  statusHistory(rideId: string) {
    return this.prisma.rideStatusHistory.findMany({ where: { rideId }, orderBy: { createdAt: "asc" } });
  }

  private async notifyStatusChange(ride: any) {
    try {
      const passengerUserId = ride.passengerProfile?.userId;
      const driverUserId = ride.driverProfile?.userId;
      const passengerName = ride.passengerProfile?.user?.name || "Passenger";
      const driverName = ride.driverProfile?.user?.name || "Driver";

      // 1. Emit socket events
      let ioInstance;
      try {
        const { getIO } = await import("../../sockets/socket.server.js");
        ioInstance = getIO();
      } catch (e) {
        // Socket server not initialized yet
      }

      if (ioInstance) {
        const event = this.getSocketEventForStatus(ride.status);
        ioInstance.to(`ride:${ride.id}`).emit(event, ride);
        ioInstance.to("role:admin").emit(event, ride);

        if (passengerUserId) {
          ioInstance.to(`user:${passengerUserId}`).emit(event, ride);
        }
        if (driverUserId) {
          ioInstance.to(`user:${driverUserId}`).emit(event, ride);
        }

        if (ride.status === "REQUESTED") {
          ioInstance.to("drivers:available").emit("ride:requested", ride);
        }
      }

      // 2. Create database notifications
      const notificationsService = new (await import("../notifications/notifications.service.js")).NotificationsService(this.prisma);

      if (ride.status === "ACCEPTED") {
        if (passengerUserId) {
          await notificationsService.create({
            userId: passengerUserId,
            type: "RIDE_ACCEPTED",
            title: "Ride Accepted",
            message: `Driver ${driverName} has accepted your ride request.`,
            metadata: { rideId: ride.id }
          });
        }
      } else if (ride.status === "DRIVER_ARRIVING") {
        if (passengerUserId) {
          await notificationsService.create({
            userId: passengerUserId,
            type: "DRIVER_ARRIVING",
            title: "Driver Arrived",
            message: `Your driver ${driverName} has arrived at the pickup location.`,
            metadata: { rideId: ride.id }
          });
        }
      } else if (ride.status === "IN_PROGRESS") {
        if (passengerUserId) {
          await notificationsService.create({
            userId: passengerUserId,
            type: "RIDE_STARTED",
            title: "Ride Started",
            message: `Your ride to ${ride.dropoffLocation} has started.`,
            metadata: { rideId: ride.id }
          });
        }
      } else if (ride.status === "COMPLETED") {
        if (passengerUserId) {
          await notificationsService.create({
            userId: passengerUserId,
            type: "RIDE_COMPLETED",
            title: "Ride Completed",
            message: `You have arrived at ${ride.dropoffLocation}. Thank you for riding!`,
            metadata: { rideId: ride.id }
          });
        }
      } else if (ride.status === "CANCELLED") {
        if (passengerUserId) {
          await notificationsService.create({
            userId: passengerUserId,
            type: "RIDE_CANCELLED",
            title: "Ride Cancelled",
            message: `Your ride has been cancelled.`,
            metadata: { rideId: ride.id }
          });
        }
        if (driverUserId) {
          await notificationsService.create({
            userId: driverUserId,
            type: "RIDE_CANCELLED",
            title: "Ride Cancelled",
            message: `The ride has been cancelled.`,
            metadata: { rideId: ride.id }
          });
        }
      } else if (ride.status === "REJECTED") {
        if (passengerUserId) {
          await notificationsService.create({
            userId: passengerUserId,
            type: "RIDE_REJECTED",
            title: "Ride Rejected",
            message: `Your ride request was rejected.`,
            metadata: { rideId: ride.id }
          });
        }
      }
    } catch (error) {
      console.error("Error in notifyStatusChange:", error);
    }
  }

  private getSocketEventForStatus(status: RideStatus): string {
    switch (status) {
      case "REQUESTED":
        return "ride:requested";
      case "ACCEPTED":
      case "DRIVER_ARRIVING":
        return "ride:accepted";
      case "IN_PROGRESS":
        return "ride:started";
      case "COMPLETED":
        return "ride:completed";
      case "CANCELLED":
        return "ride:cancelled";
      case "REJECTED":
        return "ride:rejected";
      default:
        return "ride:updated";
    }
  }

  private async transition(rideId: string, next: RideStatus, userId: string, data: Record<string, unknown> = {}) {
    const updated = await this.prisma.$transaction(async (tx) => {
      const ride = await tx.ride.findUnique({ where: { id: rideId } });
      if (!ride) throw notFound("Ride not found");
      this.ensureTransition(ride.status, next);
      const updated = await tx.ride.update({ where: { id: rideId }, data: { ...data, status: next }, include: this.include() });
      await tx.rideStatusHistory.create({ data: { rideId, status: next, changedByUserId: userId } });
      if (next === "ACCEPTED" && updated.driverProfileId) {
        await tx.driverProfile.update({ where: { id: updated.driverProfileId }, data: { status: "BUSY" } });
      }
      if ((next === "CANCELLED" || next === "REJECTED") && ride.driverProfileId) {
        await tx.driverProfile.update({ where: { id: ride.driverProfileId }, data: { status: "ONLINE" } });
      }
      return updated;
    });
    this.notifyStatusChange(updated);
    return updated;
  }

  private ensureTransition(current: RideStatus, next: RideStatus) {
    if (!transitions[current].includes(next)) throw badRequest(`Invalid ride transition from ${current} to ${next}`);
  }

  private async requireDriver(userId: string) {
    const driver = await this.prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) throw notFound("Driver profile not found");
    return driver;
  }

  private include() {
    return {
      passengerProfile: { include: { user: true } },
      driverProfile: { include: { user: true, vehicle: true } },
      rating: true,
      payment: true
    } as const;
  }
}
