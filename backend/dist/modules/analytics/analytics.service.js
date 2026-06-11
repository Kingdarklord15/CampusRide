export class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async rides() {
        const [total, byStatus] = await Promise.all([
            this.prisma.ride.count(),
            this.prisma.ride.groupBy({ by: ["status"], _count: { _all: true } })
        ]);
        return { total, byStatus };
    }
    async drivers() {
        const [total, byStatus, topRated] = await Promise.all([
            this.prisma.driverProfile.count(),
            this.prisma.driverProfile.groupBy({ by: ["status"], _count: { _all: true } }),
            this.prisma.driverProfile.findMany({ orderBy: { averageRating: "desc" }, take: 10, include: { user: true, vehicle: true } })
        ]);
        return { total, byStatus, topRated };
    }
    async demand() {
        const rides = await this.prisma.ride.groupBy({ by: ["pickupLocation"], _count: { _all: true }, orderBy: { _count: { pickupLocation: "desc" } }, take: 10 });
        return { topPickupLocations: rides };
    }
    async overview() {
        const [rides, drivers, demand] = await Promise.all([this.rides(), this.drivers(), this.demand()]);
        return { rides, drivers, demand };
    }
}
