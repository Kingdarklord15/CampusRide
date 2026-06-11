import { z } from "zod";

export const rideSchema = z.object({
  pickupLocation: z.string().min(2),
  dropoffLocation: z.string().min(2),
  fareAmount: z.coerce.number().min(0).optional(),
  distanceKm: z.coerce.number().min(0).optional()
});
