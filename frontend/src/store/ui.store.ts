"use client";

import { create } from "zustand";

type Toast = { id: string; title: string; description?: string; type?: "success" | "error" | "info" };

type UiState = {
  sidebarOpen: boolean;
  toasts: Toast[];
  setSidebarOpen: (open: boolean) => void;
  toast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toasts: [],
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toast: (toast) => set((state) => ({ toasts: [...state.toasts, { ...toast, id: Date.now().toString() }] })),
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
}));
