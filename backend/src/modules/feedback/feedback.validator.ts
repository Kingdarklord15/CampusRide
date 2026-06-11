import { z } from "zod";

export const createFeedbackSchema = z.object({
  rideId: z.string().uuid().optional(),
  category: z.enum(["RIDE_EXPERIENCE", "DRIVER_BEHAVIOR", "PAYMENT", "SAFETY", "APP_ISSUE", "OTHER"]),
  message: z.string().min(5).max(1000)
});

export const feedbackStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_REVIEW", "RESOLVED", "CLOSED"])
});
