import { z } from "zod";

export const createRideSchema = z.object({
  pickupLocation: z.string().min(2).max(200),
  pickupLatitude: z.coerce.number().min(-90).max(90).optional(),
  pickupLongitude: z.coerce.number().min(-180).max(180).optional(),
  dropoffLocation: z.string().min(2).max(200),
  dropoffLatitude: z.coerce.number().min(-90).max(90).optional(),
  dropoffLongitude: z.coerce.number().min(-180).max(180).optional(),
  fareAmount: z.coerce.number().min(0).optional(),
  distanceKm: z.coerce.number().min(0).optional()
});

export const assignDriverSchema = z.object({
  driverProfileId: z.string().uuid()
});

export const cancelRideSchema = z.object({
  reason: z.string().max(300).optional()
});
