"use client";

import { create } from "zustand";
import type { Notification } from "@/types";

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  push: (notification: Notification) => void;
  markRead: (id: string) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  push: (notification) => set((state) => ({ notifications: [notification, ...state.notifications], unreadCount: state.unreadCount + 1 })),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) => (item.id === id ? { ...item, readAt: new Date().toISOString() } : item)),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }))
}));
