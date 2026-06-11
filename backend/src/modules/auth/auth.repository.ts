import type { PrismaClient, Role } from "@prisma/client";

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { passengerProfile: true, driverProfile: { include: { vehicle: true } } }
    });
  }

  async createUser(data: { name: string; email: string; phone?: string; passwordHash: string; role: Role }) {
    return this.prisma.user.create({
      data: {
        ...data,
        passengerProfile: data.role === "PASSENGER" ? { create: {} } : undefined
      },
      include: { passengerProfile: true, driverProfile: true }
    });
  }

  updateRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    return this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash } });
  }

  touchLogin(userId: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
  }
}
