import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001/api/v1",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const { refreshToken, setTokens, logout } = useAuthStore.getState();
    if (error.response?.status === 401 && refreshToken && !original?._retry) {
      original._retry = true;
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001/api/v1"}/auth/refresh`, { refreshToken });
        setTokens(response.data.data.accessToken, response.data.data.refreshToken);
        original.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
        return api(original);
      } catch {
        logout();
      }
    }
    return Promise.reject(error);
  }
);
