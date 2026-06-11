import { api } from "@/lib/api";
import type { ApiResponse, Ride } from "@/types";

export const rideService = {
  list: async () => (await api.get<ApiResponse<Ride[]>>("/rides")).data.data,
  details: async (rideId: string) => (await api.get<ApiResponse<Ride>>(`/rides/${rideId}`)).data.data,
  create: async (data: {
    pickupLocation: string;
    pickupLatitude?: number;
    pickupLongitude?: number;
    dropoffLocation: string;
    dropoffLatitude?: number;
    dropoffLongitude?: number;
    fareAmount?: number;
    distanceKm?: number;
  }) => (await api.post<ApiResponse<Ride>>("/rides", data)).data.data,
  accept: async (rideId: string) => (await api.patch<ApiResponse<Ride>>(`/rides/${rideId}/accept`)).data.data,
  reject: async (rideId: string) => (await api.patch<ApiResponse<Ride>>(`/rides/${rideId}/reject`)).data.data,
  cancel: async (rideId: string, reason?: string) => (await api.patch<ApiResponse<Ride>>(`/rides/${rideId}/cancel`, { reason })).data.data,
  arriving: async (rideId: string) => (await api.patch<ApiResponse<Ride>>(`/rides/${rideId}/arriving`)).data.data,
  start: async (rideId: string) => (await api.patch<ApiResponse<Ride>>(`/rides/${rideId}/start`)).data.data,
  complete: async (rideId: string) => (await api.patch<ApiResponse<Ride>>(`/rides/${rideId}/complete`)).data.data
};

