"use client";

import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/auth.store";
import { useDriverStore } from "@/store/driver.store";
import { useNotificationStore } from "@/store/notification.store";
import { useRideStore } from "@/store/ride.store";
import type { Notification, Ride } from "@/types";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.accessToken);
  const status = useDriverStore((state) => state.status);
  const setStatus = useDriverStore((state) => state.setStatus);
  const setActiveRide = useRideStore((state) => state.setActiveRide);
  const addPendingRequest = useRideStore((state) => state.addPendingRequest);
  const removePendingRequest = useRideStore((state) => state.removePendingRequest);
  const pushNotification = useNotificationStore((state) => state.push);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket();
    socket.on("driver:online", () => setStatus("ONLINE"));
    socket.on("driver:offline", () => setStatus("OFFLINE"));
    socket.on("ride:requested", (ride: Ride) => addPendingRequest(ride));
    socket.on("ride:accepted", (ride: Ride) => setActiveRide(ride));
    socket.on("ride:rejected", (ride: Ride) => removePendingRequest(ride.id));
    socket.on("ride:started", (ride: Ride) => setActiveRide(ride));
    socket.on("ride:completed", (ride: Ride) => setActiveRide(ride));
    socket.on("ride:cancelled", (ride: Ride) => setActiveRide(ride));
    socket.on("notification:new", (notification: Notification) => pushNotification(notification));
    return () => {
      socket.removeAllListeners();
      disconnectSocket();
    };
  }, [token, setStatus, setActiveRide, addPendingRequest, removePendingRequest, pushNotification]);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!token || user?.role !== "DRIVER") return;
    const socket = connectSocket();
    if (status === "ONLINE") {
      socket.emit("driver:online");
    } else {
      socket.emit("driver:offline");
    }
  }, [token, status, user]);

  return children;
}
