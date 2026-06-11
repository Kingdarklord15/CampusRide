import type { Server, Socket } from "socket.io";

export const registerNotificationSocket = (_io: Server, socket: Socket) => {
  socket.on("notification:new", (payload) => {
    const userId = payload?.userId;
    if (userId) socket.to(`user:${userId}`).emit("notification:new", payload);
  });
};
