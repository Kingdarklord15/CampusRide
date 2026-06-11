import { api } from "@/lib/api";
import type { ApiResponse, User } from "@/types";

export const userService = {
  list: async () => (await api.get<ApiResponse<User[]>>("/users")).data.data,
  me: async () => (await api.get<ApiResponse<User>>("/users/me")).data.data,
  updateProfile: async (data: Partial<User>) => (await api.patch<ApiResponse<User>>("/users/me", data)).data.data,
  updateById: async (userId: string, data: Partial<User>) => (await api.patch<ApiResponse<User>>(`/users/${userId}`, data)).data.data
};

