import type { PrismaClient } from "@prisma/client";
import { notFound } from "../../utils/errors.js";

export class PassengersService {
  constructor(private readonly prisma: PrismaClient) {}

  getMine(userId: string) {
    return this.prisma.passengerProfile.findUnique({ where: { userId }, include: { user: true } });
  }

  async updateMine(userId: string, data: { universityId?: string; defaultPickupLocation?: string }) {
    const profile = await this.prisma.passengerProfile.findUnique({ where: { userId } });
    if (!profile) throw notFound("Passenger profile not found");
    return this.prisma.passengerProfile.update({ where: { id: profile.id }, data });
  }

  async history(userId: string) {
    const profile = await this.prisma.passengerProfile.findUnique({ where: { userId } });
    if (!profile) throw notFound("Passenger profile not found");
    return this.prisma.ride.findMany({
      where: { passengerProfileId: profile.id },
      include: { driverProfile: { include: { user: true, vehicle: true } }, rating: true, payment: true },
      orderBy: { requestedAt: "desc" }
    });
  }
}
