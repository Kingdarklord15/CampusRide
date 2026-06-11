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
  constructor(private readonly prisma: PrismaClient) {}

  async list(actor: AuthUser) {
    if (actor.role === "ADMIN") {
      return this.prisma.ride.findMany({ include: this.include(), orderBy: { requestedAt: "desc" } });
    }
    if (actor.role === "PASSENGER") {
      const passenger = await this.prisma.passengerProfile.findUnique({ where: { userId: actor.id } });
      if (!passenger) throw notFound("Passenger profile not found");
      return this.prisma.ride.findMany({ where: { passengerProfileId: passenger.id }, include: this.include(), orderBy: { requestedAt: "desc" } });
    }
    const driver = await this.prisma.driverProfile.findUnique({ where: { userId: actor.id } });
    if (!driver) throw notFound("Driver profile not found");
    return this.prisma.ride.findMany({ where: { driverProfileId: driver.id }, include: this.include(), orderBy: { requestedAt: "desc" } });
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
    return this.prisma.$transaction(async (tx) => {
      const ride = await tx.ride.create({ data: { ...data, passengerProfileId: passenger.id }, include: this.include() });
      await tx.rideStatusHistory.create({ data: { rideId: ride.id, status: "REQUESTED", changedByUserId: userId } });
      return ride;
    });
  }

  assignDriver(actor: AuthUser, rideId: string, driverProfileId: string) {
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

  cancel(actor: AuthUser, rideId: string, reason?: string) {
    return this.transition(rideId, "CANCELLED", actor.id, { cancelledAt: new Date(), cancellationReason: reason });
  }

  arriving(actor: AuthUser, rideId: string) {
    return this.transition(rideId, "DRIVER_ARRIVING", actor.id);
  }

  start(actor: AuthUser, rideId: string) {
    return this.transition(rideId, "IN_PROGRESS", actor.id, { startedAt: new Date() });
  }

  async complete(actor: AuthUser, rideId: string) {
    return this.prisma.$transaction(async (tx) => {
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
  }

  statusHistory(rideId: string) {
    return this.prisma.rideStatusHistory.findMany({ where: { rideId }, orderBy: { createdAt: "asc" } });
  }

  private async transition(rideId: string, next: RideStatus, userId: string, data: Record<string, unknown> = {}) {
    return this.prisma.$transaction(async (tx) => {
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
