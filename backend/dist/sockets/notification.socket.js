export const registerNotificationSocket = (_io, socket) => {
    socket.on("notification:new", (payload) => {
        const userId = payload?.userId;
        if (userId)
            socket.to(`user:${userId}`).emit("notification:new", payload);
    });
};
