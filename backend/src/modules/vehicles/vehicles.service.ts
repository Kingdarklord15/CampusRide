import type { PrismaClient } from "@prisma/client";
import { notFound } from "../../utils/errors.js";

export class VehiclesService {
  constructor(private readonly prisma: PrismaClient) {}

  private async driverProfileId(userId: string) {
    const profile = await this.prisma.driverProfile.findUnique({ where: { userId } });
    if (!profile) throw notFound("Driver profile not found");
    return profile.id;
  }

  async getMine(userId: string) {
    const driverProfileId = await this.driverProfileId(userId);
    return this.prisma.vehicle.findUnique({ where: { driverProfileId } });
  }

  async add(
    userId: string,
    data: { registrationNumber: string; vehicleType: "E_RICKSHAW" | "CART" | "SHUTTLE"; model?: string; color?: string; capacity: number; isActive?: boolean }
  ) {
    const driverProfileId = await this.driverProfileId(userId);
    return this.prisma.vehicle.create({ data: { ...data, driverProfileId } });
  }

  async update(
    userId: string,
    data: Partial<{ registrationNumber: string; vehicleType: "E_RICKSHAW" | "CART" | "SHUTTLE"; model: string; color: string; capacity: number; isActive: boolean }>
  ) {
    const driverProfileId = await this.driverProfileId(userId);
    return this.prisma.vehicle.update({ where: { driverProfileId }, data });
  }
}
