import { z } from "zod";
export const updateUserSchema = z.object({
    name: z.string().min(2).max(120).optional(),
    phone: z.string().min(8).max(20).nullable().optional()
});
