import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";

export const analyticsService = {
  overview: async () => (await api.get<ApiResponse<Record<string, unknown>>>("/analytics/overview")).data.data,
  rides: async () => (await api.get<ApiResponse<Record<string, unknown>>>("/analytics/rides")).data.data,
  drivers: async () => (await api.get<ApiResponse<Record<string, unknown>>>("/analytics/drivers")).data.data,
  demand: async () => (await api.get<ApiResponse<Record<string, unknown>>>("/analytics/demand")).data.data
};
