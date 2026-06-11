import type { PrismaClient } from "@prisma/client";
import type { AuthUser } from "../../middleware/auth.middleware.js";
import { forbidden, notFound } from "../../utils/errors.js";

export class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  private userSelect() {
    return {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true
    } as const;
  }

  getProfile(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        ...this.userSelect(),
        passengerProfile: true,
        driverProfile: { include: { vehicle: true } }
      }
    });
  }

  listUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: this.userSelect()
    });
  }

  async updateProfile(actor: AuthUser, targetUserId: string, data: { name?: string; phone?: string | null }) {
    if (actor.id !== targetUserId && actor.role !== "ADMIN") throw forbidden();
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw notFound("User not found");
    return this.prisma.user.update({
      where: { id: targetUserId },
      data,
      select: this.userSelect()
    });
  }
}
