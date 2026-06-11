import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { verifyAccessToken } from "../config/jwt.js";
import { prisma } from "../config/prisma.js";
import { socketConfig } from "../config/socket.js";
import { registerDriverSocket } from "./driver.socket.js";
import { registerNotificationSocket } from "./notification.socket.js";
import { registerRideSocket } from "./ride.socket.js";

let io: Server | null = null;

export const createSocketServer = (server: HttpServer) => {
  io = new Server(server, socketConfig);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.toString().replace("Bearer ", "");
      if (!token) throw new Error("Missing token");
      const payload = verifyAccessToken(token);
      const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, role: true, isActive: true } });
      if (!user?.isActive) throw new Error("Invalid user");
      socket.data.user = user;
      socket.join(`user:${user.id}`);
      socket.join(`role:${user.role.toLowerCase()}`);
      next();
    } catch (error) {
      next(new Error("Unauthorized socket connection"));
    }
  });

  io.on("connection", (socket) => {
    registerDriverSocket(io!, socket);
    registerRideSocket(io!, socket);
    registerNotificationSocket(io!, socket);
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket server has not been initialized");
  return io;
};

export const emitToUser = (userId: string, event: string, payload: unknown) => {
  if (io) io.to(`user:${userId}`).emit(event, payload);
};
