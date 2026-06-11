import { z } from "zod";

export const createDriverProfileSchema = z.object({
  licenseNumber: z.string().min(4).max(80)
});

export const updateDriverProfileSchema = z.object({
  licenseNumber: z.string().min(4).max(80).optional(),
  currentLatitude: z.coerce.number().min(-90).max(90).optional(),
  currentLongitude: z.coerce.number().min(-180).max(180).optional()
});

export const driverStatusSchema = z.object({
  status: z.enum(["ONLINE", "OFFLINE", "BUSY"])
});
