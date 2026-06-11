import { badRequest, forbidden, notFound } from "../../utils/errors.js";
const transitions = {
    REQUESTED: ["ACCEPTED", "CANCELLED", "REJECTED"],
    ACCEPTED: ["DRIVER_ARRIVING", "CANCELLED"],
    DRIVER_ARRIVING: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
    REJECTED: []
};
export class RidesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(actor) {
        if (actor.role === "ADMIN") {
            return this.prisma.ride.findMany({ include: this.include(), orderBy: { requestedAt: "desc" } });
        }
        if (actor.role === "PASSENGER") {
            const passenger = await this.prisma.passengerProfile.findUnique({ where: { userId: actor.id } });
            if (!passenger)
                throw notFound("Passenger profile not found");
            return this.prisma.ride.findMany({ where: { passengerProfileId: passenger.id }, include: this.include(), orderBy: { requestedAt: "desc" } });
        }
        const driver = await this.prisma.driverProfile.findUnique({ where: { userId: actor.id } });
        if (!driver)
            throw notFound("Driver profile not found");
        return this.prisma.ride.findMany({ where: { driverProfileId: driver.id }, include: this.include(), orderBy: { requestedAt: "desc" } });
    }
    getById(rideId) {
        return this.prisma.ride.findUniqueOrThrow({ where: { id: rideId }, include: this.include() });
    }
    async create(userId, data) {
        const passenger = await this.prisma.passengerProfile.findUnique({ where: { userId } });
        if (!passenger)
            throw notFound("Passenger profile not found");
        return this.prisma.$transaction(async (tx) => {
            const ride = await tx.ride.create({ data: { ...data, passengerProfileId: passenger.id }, include: this.include() });
            await tx.rideStatusHistory.create({ data: { rideId: ride.id, status: "REQUESTED", changedByUserId: userId } });
            return ride;
        });
    }
    assignDriver(actor, rideId, driverProfileId) {
        if (actor.role !== "ADMIN")
            throw forbidden();
        return this.transition(rideId, "ACCEPTED", actor.id, { driverProfileId, acceptedAt: new Date() });
    }
    async accept(actor, rideId) {
        const driver = await this.requireDriver(actor.id);
        return this.transition(rideId, "ACCEPTED", actor.id, { driverProfileId: driver.id, acceptedAt: new Date() });
    }
    async reject(actor, rideId) {
        await this.requireDriver(actor.id);
        return this.transition(rideId, "REJECTED", actor.id);
    }
    cancel(actor, rideId, reason) {
        return this.transition(rideId, "CANCELLED", actor.id, { cancelledAt: new Date(), cancellationReason: reason });
    }
    arriving(actor, rideId) {
        return this.transition(rideId, "DRIVER_ARRIVING", actor.id);
    }
    start(actor, rideId) {
        return this.transition(rideId, "IN_PROGRESS", actor.id, { startedAt: new Date() });
    }
    async complete(actor, rideId) {
        return this.prisma.$transaction(async (tx) => {
            const ride = await tx.ride.findUnique({ where: { id: rideId } });
            if (!ride)
                throw notFound("Ride not found");
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
    statusHistory(rideId) {
        return this.prisma.rideStatusHistory.findMany({ where: { rideId }, orderBy: { createdAt: "asc" } });
    }
    async transition(rideId, next, userId, data = {}) {
        return this.prisma.$transaction(async (tx) => {
            const ride = await tx.ride.findUnique({ where: { id: rideId } });
            if (!ride)
                throw notFound("Ride not found");
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
    ensureTransition(current, next) {
        if (!transitions[current].includes(next))
            throw badRequest(`Invalid ride transition from ${current} to ${next}`);
    }
    async requireDriver(userId) {
        const driver = await this.prisma.driverProfile.findUnique({ where: { userId } });
        if (!driver)
            throw notFound("Driver profile not found");
        return driver;
    }
    include() {
        return {
            passengerProfile: { include: { user: true } },
            driverProfile: { include: { user: true, vehicle: true } },
            rating: true,
            payment: true
        };
    }
}
