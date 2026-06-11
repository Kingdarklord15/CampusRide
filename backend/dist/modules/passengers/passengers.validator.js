import { z } from "zod";
export const updatePassengerSchema = z.object({
    universityId: z.string().min(1).max(80).optional(),
    defaultPickupLocation: z.string().min(1).max(160).optional()
});
