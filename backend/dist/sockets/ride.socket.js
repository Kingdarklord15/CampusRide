import { prisma } from "../config/prisma.js";
export const registerRideSocket = (io, socket) => {
    socket.on("ride:requested", async (rideId) => {
        console.log("RIDE REQUESTED:", rideId);
        const ride = await prisma.ride.findUnique({ where: { id: rideId }, include: { passengerProfile: true } });
        if (!ride)
            return socket.emit("socket:error", { message: "Ride not found" });
        socket.join(`ride:${ride.id}`);
        io.to("drivers:available").emit("ride:requested", ride);
        io.to("role:admin").emit("ride:requested", ride);
    });
    socket.on("ride:accepted", (ride) => {
        io.to(`ride:${ride.id}`).emit("ride:accepted", ride);
        io.to("role:admin").emit("ride:accepted", ride);
    });
    socket.on("ride:rejected", (ride) => {
        io.to(`ride:${ride.id}`).emit("ride:rejected", ride);
        io.to("role:admin").emit("ride:rejected", ride);
    });
    socket.on("ride:cancelled", (ride) => {
        io.to(`ride:${ride.id}`).emit("ride:cancelled", ride);
        io.to("role:admin").emit("ride:cancelled", ride);
    });
    socket.on("ride:started", (ride) => {
        io.to(`ride:${ride.id}`).emit("ride:started", ride);
        io.to("role:admin").emit("ride:started", ride);
    });
    socket.on("ride:completed", (ride) => {
        io.to(`ride:${ride.id}`).emit("ride:completed", ride);
        io.to("role:admin").emit("ride:completed", ride);
    });
};
