import { prisma } from "../config/prisma.js";
export const registerDriverSocket = (io, socket) => {
    socket.on("driver:online", async (payload) => {
        const user = socket.data.user;
        if (user.role !== "DRIVER")
            return socket.emit("socket:error", { message: "Driver role required" });
        const driver = await prisma.driverProfile.update({
            where: { userId: user.id },
            data: { status: "ONLINE", currentLatitude: payload?.latitude, currentLongitude: payload?.longitude }
        });
        console.log("DRIVER JOINED ROOM:", driver.id);
        socket.join("drivers:available");
        socket.join(`driver:${driver.id}`);
        io.to("role:admin").emit("driver:online", driver);
    });
    socket.on("driver:offline", async () => {
        const user = socket.data.user;
        if (user.role !== "DRIVER")
            return socket.emit("socket:error", { message: "Driver role required" });
        const driver = await prisma.driverProfile.update({ where: { userId: user.id }, data: { status: "OFFLINE" } });
        socket.leave("drivers:available");
        io.to("role:admin").emit("driver:offline", driver);
    });
};
