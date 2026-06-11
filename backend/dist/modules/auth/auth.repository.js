export class AuthRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { passengerProfile: true, driverProfile: { include: { vehicle: true } } }
        });
    }
    async createUser(data) {
        return this.prisma.user.create({
            data: {
                ...data,
                passengerProfile: data.role === "PASSENGER" ? { create: {} } : undefined
            },
            include: { passengerProfile: true, driverProfile: true }
        });
    }
    updateRefreshTokenHash(userId, refreshTokenHash) {
        return this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash } });
    }
    touchLogin(userId) {
        return this.prisma.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
    }
}
