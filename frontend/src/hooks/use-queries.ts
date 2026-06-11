"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { analyticsService } from "@/services/analytics.service";
import { driverService } from "@/services/driver.service";
import { notificationService } from "@/services/notification.service";
import { paymentService } from "@/services/payment.service";
import { rideService } from "@/services/ride.service";
import { userService } from "@/services/user.service";

export const useDrivers = () => useQuery({ queryKey: queryKeys.drivers, queryFn: driverService.list });
export const useAvailableDrivers = () => useQuery({ queryKey: queryKeys.availableDrivers, queryFn: driverService.available });
export const useRides = () => useQuery({ queryKey: queryKeys.rides, queryFn: rideService.list });
export const useNotifications = () => useQuery({ queryKey: queryKeys.notifications, queryFn: notificationService.list });
export const usePayments = () => useQuery({ queryKey: queryKeys.payments, queryFn: paymentService.history });
export const useAnalyticsOverview = () => useQuery({ queryKey: queryKeys.analyticsOverview, queryFn: analyticsService.overview });
export const useUsers = () => useQuery({ queryKey: ["users"], queryFn: userService.list });

export const useCreateRide = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: rideService.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rides }) });
};

export const useRideActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.rides });
  return {
    acceptRide: useMutation({ mutationFn: rideService.accept, onSuccess: refresh }),
    rejectRide: useMutation({ mutationFn: rideService.reject, onSuccess: refresh }),
    completeRide: useMutation({ mutationFn: rideService.complete, onSuccess: refresh }),
    createPayment: useMutation({ mutationFn: paymentService.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.payments }) }),
    updateProfile: useMutation({ mutationFn: userService.updateProfile, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }) })
  };
};
