import type { DriverStatus, PrismaClient } from "@prisma/client";
import type { AuthUser } from "../../middleware/auth.middleware.js";
import { forbidden, notFound } from "../../utils/errors.js";

export class DriversService {
  constructor(private readonly prisma: PrismaClient) {}

  list() {
    return this.prisma.driverProfile.findMany({ include: { user: true, vehicle: true }, orderBy: { createdAt: "desc" } });
  }

  available() {
    return this.prisma.driverProfile.findMany({
      where: { status: "ONLINE", verifiedAt: { not: null }, vehicle: { isActive: true } },
      include: { user: true, vehicle: true }
    });
  }

  getMine(userId: string) {
    return this.prisma.driverProfile.findUnique({ where: { userId }, include: { user: true, vehicle: true } });
  }

  async create(actor: AuthUser, data: { licenseNumber: string }) {
    if (actor.role !== "DRIVER" && actor.role !== "ADMIN") throw forbidden();
    return this.prisma.driverProfile.create({ data: { userId: actor.id, licenseNumber: data.licenseNumber }, include: { vehicle: true } });
  }

  async update(actor: AuthUser, data: { licenseNumber?: string; currentLatitude?: number; currentLongitude?: number }) {
    const profile = await this.prisma.driverProfile.findUnique({ where: { userId: actor.id } });
    if (!profile) throw notFound("Driver profile not found");
    return this.prisma.driverProfile.update({ where: { id: profile.id }, data, include: { vehicle: true } });
  }

  async setStatus(actor: AuthUser, status: DriverStatus) {
    const profile = await this.prisma.driverProfile.findUnique({ where: { userId: actor.id } });
    if (!profile) throw notFound("Driver profile not found");
    return this.prisma.driverProfile.update({ where: { id: profile.id }, data: { status }, include: { vehicle: true } });
  }

  verify(driverId: string) {
    return this.prisma.driverProfile.update({ where: { id: driverId }, data: { verifiedAt: new Date() }, include: { user: true, vehicle: true } });
  }

  suspend(driverId: string) {
    return this.prisma.driverProfile.update({ where: { id: driverId }, data: { status: "SUSPENDED" }, include: { user: true, vehicle: true } });
  }
}
