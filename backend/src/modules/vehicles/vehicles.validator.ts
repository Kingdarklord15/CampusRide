import { z } from "zod";

export const vehicleSchema = z.object({
  registrationNumber: z.string().min(4).max(40),
  vehicleType: z.enum(["E_RICKSHAW", "CART", "SHUTTLE"]),
  model: z.string().max(80).optional(),
  color: z.string().max(40).optional(),
  capacity: z.coerce.number().int().min(1).max(12),
  isActive: z.boolean().optional()
});

export const updateVehicleSchema = vehicleSchema.partial();
