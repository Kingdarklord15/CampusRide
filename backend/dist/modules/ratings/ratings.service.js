import { badRequest, notFound } from "../../utils/errors.js";
export class RatingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submit(userId, data) {
        const ride = await this.prisma.ride.findUnique({ where: { id: data.rideId }, include: { passengerProfile: true } });
        if (!ride || !ride.driverProfileId)
            throw notFound("Completed ride with driver not found");
        if (ride.status !== "COMPLETED")
            throw badRequest("Only completed rides can be rated");
        if (ride.passengerProfile.userId !== userId)
            throw badRequest("Only the passenger can rate this ride");
        return this.prisma.$transaction(async (tx) => {
            const rating = await tx.rating.create({
                data: { rideId: data.rideId, passengerUserId: userId, driverProfileId: ride.driverProfileId, score: data.score, comment: data.comment }
            });
            const aggregate = await tx.rating.aggregate({ where: { driverProfileId: ride.driverProfileId }, _avg: { score: true } });
            await tx.driverProfile.update({ where: { id: ride.driverProfileId }, data: { averageRating: aggregate._avg.score ?? 0 } });
            return rating;
        });
    }
    driverRatings(driverProfileId) {
        return this.prisma.rating.findMany({ where: { driverProfileId }, include: { passengerUser: true, ride: true }, orderBy: { createdAt: "desc" } });
    }
}
