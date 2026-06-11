"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, XCircle, MapPin, Compass, ShieldAlert } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useRides, useRideActions } from "@/hooks/use-queries";
import { useRideStore } from "@/store/ride.store";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function DriverRideRequestsPage() {
  const { data: rides, isLoading, refetch } = useRides();
  const { acceptRide, rejectRide } = useRideActions();
  const { setActiveRide } = useRideStore();
  const showToast = useUiStore((state) => state.toast);
  const router = useRouter();

  // Filter for pending ride requests
  const pendingRequests = rides?.filter((ride) => ride.status === "REQUESTED") || [];

  const handleAccept = async (rideId: string) => {
    try {
      const acceptedRide = await acceptRide.mutateAsync(rideId);
      setActiveRide(acceptedRide);
      showToast({ title: "Ride Accepted", description: "Navigate to pickup location.", type: "success" });
      router.push("/driver/active-ride");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to accept ride";
      showToast({ title: "Error", description: msg, type: "error" });
    }
  };

  const handleReject = async (rideId: string) => {
    try {
      await rejectRide.mutateAsync(rideId);
      showToast({ title: "Request Declined", description: "You rejected the ride request.", type: "info" });
      refetch();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to decline ride";
      showToast({ title: "Error", description: msg, type: "error" });
    }
  };

  return (
    <DashboardShell role="DRIVER">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/driver/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900">Incoming Ride Requests</h1>
            <p className="text-zinc-500">Accept assignments from passengers across campus.</p>
          </div>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        ) : pendingRequests.length > 0 ? (
          <div className="grid gap-4">
            {pendingRequests.map((ride) => (
              <div key={ride.id} className="p-6 border rounded-2xl bg-white hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-2 py-0.5">
                      New Request
                    </span>
                    <h3 className="font-bold text-zinc-900 mt-2">
                      Passenger: {ride.passengerProfile?.user?.name || "Student"}
                    </h3>
                  </div>

                  <div className="grid gap-1 text-sm text-zinc-700">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
                      <span className="font-semibold text-zinc-900">Pickup:</span> {ride.pickupLocation}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-zinc-900">Dropoff:</span> {ride.dropoffLocation}
                    </p>
                  </div>

                  <div className="flex gap-4 text-xs text-zinc-500 border-t pt-2">
                    <p>Est. Distance: <span className="font-bold text-zinc-700">{ride.distanceKm} km</span></p>
                    <p>Est. Fare: <span className="font-bold text-zinc-700">₹{ride.fareAmount}</span></p>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(ride.id)}
                    className="w-full md:w-auto text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 gap-2"
                    disabled={rejectRide.isPending}
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                  <Button
                    onClick={() => handleAccept(ride.id)}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    disabled={acceptRide.isPending}
                  >
                    <CheckCircle className="h-4 w-4" /> Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-zinc-50/50 min-h-[350px]">
            <Compass className="h-12 w-12 text-zinc-300 mb-4 animate-spin-slow" />
            <h2 className="text-xl font-bold text-zinc-900">Scanning for requests</h2>
            <p className="text-sm text-zinc-500 max-w-sm text-center mt-2">
              There are no active passenger requests on campus at the moment. Keep this page open; new requests will pop up in real-time.
            </p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
