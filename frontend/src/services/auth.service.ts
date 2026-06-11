import { api } from "@/lib/api";
import type { ApiResponse, User } from "@/types";

export type AuthPayload = { user: User; accessToken: string; refreshToken: string };

export const authService = {
  login: async (data: { email: string; password: string }) => (await api.post<ApiResponse<AuthPayload>>("/auth/login", data)).data.data,
  register: async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
  }) =>
    (await api.post<ApiResponse<AuthPayload>>(
      "/auth/register",
      data
    )).data.data,
  me: async () => (await api.get<ApiResponse<User>>("/auth/me")).data.data,
  logout: async () => api.post("/auth/logout")
};
