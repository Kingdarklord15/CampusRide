import { api } from "@/lib/api";
import type { ApiResponse, Vehicle } from "@/types";

export const vehicleService = {
  getMine: async () => (await api.get<ApiResponse<Vehicle | null>>("/vehicles/me")).data.data,
  add: async (data: { registrationNumber: string; vehicleType: "E_RICKSHAW" | "CART" | "SHUTTLE"; model?: string; color?: string; capacity: number; isActive?: boolean }) =>
    (await api.post<ApiResponse<Vehicle>>("/vehicles", data)).data.data,
  update: async (data: Partial<{ registrationNumber: string; vehicleType: "E_RICKSHAW" | "CART" | "SHUTTLE"; model: string; color: string; capacity: number; isActive: boolean }>) =>
    (await api.patch<ApiResponse<Vehicle>>("/vehicles/me", data)).data.data,
};
