import type { FeedbackCategory, FeedbackStatus, PrismaClient } from "@prisma/client";

export class FeedbackService {
  constructor(private readonly prisma: PrismaClient) {}

  submit(userId: string, data: { rideId?: string; category: FeedbackCategory; message: string }) {
    return this.prisma.feedback.create({ data: { ...data, userId } });
  }

  list() {
    return this.prisma.feedback.findMany({ include: { user: true, ride: true }, orderBy: { createdAt: "desc" } });
  }

  updateStatus(feedbackId: string, status: FeedbackStatus) {
    return this.prisma.feedback.update({ where: { id: feedbackId }, data: { status }, include: { user: true, ride: true } });
  }
}
