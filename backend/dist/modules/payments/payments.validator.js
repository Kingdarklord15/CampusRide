import { z } from "zod";
export const createPaymentSchema = z.object({
    rideId: z.string().uuid(),
    amount: z.coerce.number().min(0),
    method: z.enum(["CASH", "MOCK_UPI", "WALLET"]).default("MOCK_UPI")
});
export const paymentStatusSchema = z.object({
    status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"])
});
