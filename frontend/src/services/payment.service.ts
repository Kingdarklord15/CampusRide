import { api } from "@/lib/api";
import type { ApiResponse, Payment } from "@/types";

export const paymentService = {
  create: async (data: { rideId: string; amount: number; method: "CASH" | "MOCK_UPI" | "WALLET" }) => (await api.post<ApiResponse<Payment>>("/payments", data)).data.data,
  history: async () => (await api.get<ApiResponse<Payment[]>>("/payments")).data.data
};
