export class FeedbackService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    submit(userId, data) {
        return this.prisma.feedback.create({ data: { ...data, userId } });
    }
    list() {
        return this.prisma.feedback.findMany({ include: { user: true, ride: true }, orderBy: { createdAt: "desc" } });
    }
    updateStatus(feedbackId, status) {
        return this.prisma.feedback.update({ where: { id: feedbackId }, data: { status }, include: { user: true, ride: true } });
    }
}
