import { emitToUser } from "../../sockets/socket.server.js";
export class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const notification = await this.prisma.notification.create({ data });
        emitToUser(data.userId, "notification:new", notification);
        return notification;
    }
    list(userId) {
        return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    }
    read(userId, notificationId) {
        return this.prisma.notification.update({ where: { id: notificationId, userId }, data: { readAt: new Date() } });
    }
    readAll(userId) {
        return this.prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
    }
}
