import { z } from "zod";
export const createNotificationSchema = z.object({
    userId: z.string().uuid(),
    type: z.enum([
        "RIDE_REQUESTED",
        "RIDE_ACCEPTED",
        "RIDE_REJECTED",
        "RIDE_STARTED",
        "RIDE_COMPLETED",
        "RIDE_CANCELLED",
        "DRIVER_ARRIVING",
        "PAYMENT_UPDATED",
        "RATING_RECEIVED",
        "SYSTEM_ALERT"
    ]),
    title: z.string().min(1).max(120),
    message: z.string().min(1).max(500),
    metadata: z.record(z.unknown()).optional()
});
