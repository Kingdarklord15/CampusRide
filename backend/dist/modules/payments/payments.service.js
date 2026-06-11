import crypto from "node:crypto";
export class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createMockUpi(data) {
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
    updateStatus(paymentId, status) {
        return this.prisma.payment.update({ where: { id: paymentId }, data: { status, paidAt: status === "PAID" ? new Date() : undefined } });
    }
}
