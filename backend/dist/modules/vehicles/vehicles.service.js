import { notFound } from "../../utils/errors.js";
export class VehiclesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async driverProfileId(userId) {
        const profile = await this.prisma.driverProfile.findUnique({ where: { userId } });
        if (!profile)
            throw notFound("Driver profile not found");
        return profile.id;
    }
    async getMine(userId) {
        const driverProfileId = await this.driverProfileId(userId);
        return this.prisma.vehicle.findUnique({ where: { driverProfileId } });
    }
    async add(userId, data) {
        const driverProfileId = await this.driverProfileId(userId);
        return this.prisma.vehicle.create({ data: { ...data, driverProfileId } });
    }
    async update(userId, data) {
        const driverProfileId = await this.driverProfileId(userId);
        return this.prisma.vehicle.update({ where: { driverProfileId }, data });
    }
}
