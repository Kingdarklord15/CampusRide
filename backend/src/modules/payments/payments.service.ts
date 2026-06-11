import crypto from "node:crypto";
import type { PaymentStatus, PrismaClient } from "@prisma/client";

export class PaymentsService {
  constructor(private readonly prisma: PrismaClient) {}

  createMockUpi(data: { rideId: string; amount: number; method: "CASH" | "MOCK_UPI" | "WALLET" }) {
    return this.prisma.payment.create({
      data: {
        ...data,
        status: data.method === "MOCK_UPI" ? "PAID" : "PENDING",
        providerReference: data.method === "MOCK_UPI" ? `mock_upi_${crypto.randomUUID()}` : undefined,
        paidAt: data.method === "MOCK_UPI" ? new Date() : undefined
      }
    });
  }

  history() {
    return this.prisma.payment.findMany({ include: { ride: true }, orderBy: { createdAt: "desc" } });
  }

  updateStatus(paymentId: string, status: PaymentStatus) {
    return this.prisma.payment.update({ where: { id: paymentId }, data: { status, paidAt: status === "PAID" ? new Date() : undefined } });
  }
}
