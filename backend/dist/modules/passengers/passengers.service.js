import { notFound } from "../../utils/errors.js";
export class PassengersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getMine(userId) {
        return this.prisma.passengerProfile.findUnique({ where: { userId }, include: { user: true } });
    }
    async updateMine(userId, data) {
        const profile = await this.prisma.passengerProfile.findUnique({ where: { userId } });
        if (!profile)
            throw notFound("Passenger profile not found");
        return this.prisma.passengerProfile.update({ where: { id: profile.id }, data });
    }
    async history(userId) {
        const profile = await this.prisma.passengerProfile.findUnique({ where: { userId } });
        if (!profile)
            throw notFound("Passenger profile not found");
        return this.prisma.ride.findMany({
            where: { passengerProfileId: profile.id },
            include: { driverProfile: { include: { user: true, vehicle: true } }, rating: true, payment: true },
            orderBy: { requestedAt: "desc" }
        });
    }
}
