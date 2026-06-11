"use client";

import { create } from "zustand";
import type { Ride } from "@/types";

type RideState = {
  activeRide: Ride | null;
  pendingRequests: Ride[];
  setActiveRide: (ride: Ride | null) => void;
  addPendingRequest: (ride: Ride) => void;
  removePendingRequest: (rideId: string) => void;
};

export const useRideStore = create<RideState>((set) => ({
  activeRide: null,
  pendingRequests: [],
  setActiveRide: (activeRide) => set({ activeRide }),
  addPendingRequest: (ride) => set((state) => ({ pendingRequests: [ride, ...state.pendingRequests.filter((item) => item.id !== ride.id)] })),
  removePendingRequest: (rideId) => set((state) => ({ pendingRequests: state.pendingRequests.filter((ride) => ride.id !== rideId) }))
}));
