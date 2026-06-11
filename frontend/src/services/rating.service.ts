import { api } from "@/lib/api";

export const ratingService = {
  submit: async (data: { rideId: string; score: number; comment?: string }) => (await api.post("/ratings", data)).data.data,
  byDriver: async (driverProfileId: string) => (await api.get(`/ratings/driver/${driverProfileId}`)).data.data
};
