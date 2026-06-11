import { api } from "@/lib/api";
import type { ApiResponse, DriverProfile } from "@/types";

export const driverService = {
  list: async () => (await api.get<ApiResponse<DriverProfile[]>>("/drivers")).data.data,
  available: async () => (await api.get<ApiResponse<DriverProfile[]>>("/drivers/available")).data.data,
  me: async () => (await api.get<ApiResponse<DriverProfile | null>>("/drivers/me")).data.data,
  create: async (data: { licenseNumber: string }) => (await api.post<ApiResponse<DriverProfile>>("/drivers/me", data)).data.data,
  setStatus: async (status: "ONLINE" | "OFFLINE" | "BUSY") => (await api.patch<ApiResponse<DriverProfile>>("/drivers/me/status", { status })).data.data,
  updateProfile: async (data: Record<string, unknown>) => (await api.patch<ApiResponse<DriverProfile>>("/drivers/me", data)).data.data,
  verify: async (driverId: string) => (await api.patch<ApiResponse<DriverProfile>>(`/drivers/${driverId}/verify`)).data.data,
  suspend: async (driverId: string) => (await api.patch<ApiResponse<DriverProfile>>(`/drivers/${driverId}/suspend`)).data.data
};


