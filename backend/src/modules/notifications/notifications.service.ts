import type { NotificationType, PrismaClient, Prisma } from "@prisma/client";
import { emitToUser } from "../../sockets/socket.server.js";

export class NotificationsService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: { userId: string; type: NotificationType; title: string; message: string; metadata?: Prisma.InputJsonValue }) {
    const notification = await this.prisma.notification.create({ data });
    emitToUser(data.userId, "notification:new", notification);
    return notification;
  }

  list(userId: string) {
    return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  read(userId: string, notificationId: string) {
    return this.prisma.notification.update({ where: { id: notificationId, userId }, data: { readAt: new Date() } });
  }

  readAll(userId: string) {
    return this.prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
  }
}
