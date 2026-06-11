import { api } from "@/lib/api";
import type { ApiResponse, Notification } from "@/types";

export const notificationService = {
  list: async () => (await api.get<ApiResponse<Notification[]>>("/notifications")).data.data,
  read: async (id: string) => (await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`)).data.data,
  readAll: async () => (await api.patch("/notifications/read-all")).data.data
};
