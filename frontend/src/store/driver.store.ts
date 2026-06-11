"use client";

import { create } from "zustand";
import type { DriverStatus } from "@/types";

type DriverState = {
  status: DriverStatus;
  setStatus: (status: DriverStatus) => void;
};

export const useDriverStore = create<DriverState>((set) => ({
  status: "OFFLINE",
  setStatus: (status) => set({ status })
}));
