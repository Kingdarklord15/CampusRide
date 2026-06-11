"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Car, MapPin, Phone, Star, XCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LiveMap } from "@/components/map";
import { RideStatusTracker } from "@/components/cards/ride-status-tracker";
import { useRideStore } from "@/store/ride.store";
import { useRides } from "@/hooks/use-queries";
import { rideService } from "@/services/ride.service";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";

export default function ActiveRidePage() {
  const { activeRide, setActiveRide } = useRideStore();
  const { data: rides, refetch } = useRides();
  const [cancelling, setCancelling] = useState(false);
  const showToast = useUiStore((state) => state.toast);
  const router = useRouter();

  // Load active ride on refresh
  useEffect(() => {
    if (rides) {
      const active = rides.find((r) =>
        ["REQUESTED", "ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS"].includes(r.status)
      );
      if (active) setActiveRide(active);
    }
  }, [rides, setActiveRide]);

  const handleCancel = async () => {
    if (!activeRide) return;
    setCancelling(true);
    try {
      await rideService.cancel(activeRide.id, "Passenger cancelled request");
      setActiveRide(null);
      refetch();
      showToast({ title: "Ride Cancelled", description: "Your ride request has been cancelled.", type: "info" });
      router.push("/passenger/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to cancel ride";
      showToast({ title: "Cancellation Failed", description: msg, type: "error" });
    } finally {
      setCancelling(false);
    }
  };

  if (!activeRide) {
    return (
      <DashboardShell role="PASSENGER">
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-zinc-50/50 min-h-[450px]">
          <Car className="h-12 w-12 text-zinc-300 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-zinc-900">No active ride</h2>
          <p className="text-sm text-zinc-500 max-w-sm text-center mt-2 mb-6">
            You don't have an active ride booking at the moment. Plan your trip and request one.
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/passenger/book-ride">Book a Ride</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  // Mock driver coordinate changes based on ride status
  let driverLat = undefined;
  let driverLng = undefined;
  if (activeRide.status === "ACCEPTED" || activeRide.status === "DRIVER_ARRIVING") {
    // Position driver slightly away from pickup location
    driverLat = Number(activeRide.pickupLatitude || 28.545) + 0.003;
    driverLng = Number(activeRide.pickupLongitude || 77.192) - 0.002;
  } else if (activeRide.status === "IN_PROGRESS") {
    // Position driver halfway between pickup and dropoff
    const pLat = Number(activeRide.pickupLatitude || 28.545);
    const pLng = Number(activeRide.pickupLongitude || 77.192);
    const dLat = Number(activeRide.dropoffLatitude || 28.546);
    const dLng = Number(activeRide.dropoffLongitude || 77.1895);
    driverLat = (pLat + dLat) / 2;
    driverLng = (pLng + dLng) / 2;
  }

  const isCompleted = activeRide.status === "COMPLETED";

  return (
    <DashboardShell role="PASSENGER">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/passenger/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900">Track Ride Status</h1>
            <p className="text-zinc-500">Live operational status and driver information.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Tracking controls */}
          <div className="space-y-6">
            {/* Status Tracker */}
            <RideStatusTracker status={activeRide.status} />

            {/* Ride Details Card */}
            <div className="p-5 border rounded-2xl bg-white space-y-4">
              <h3 className="font-bold text-zinc-900 border-b pb-2">Trip Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-zinc-500">Pickup Location</p>
                  <p className="font-medium text-zinc-800 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
                    {activeRide.pickupLocation}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Dropoff Location</p>
                  <p className="font-medium text-zinc-800 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                    {activeRide.dropoffLocation}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-3">
                  <div>
                    <p className="text-xs text-zinc-500">Distance</p>
                    <p className="font-bold text-zinc-800 mt-0.5">{activeRide.distanceKm} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Fare Amount</p>
                    <p className="font-bold text-emerald-600 mt-0.5">₹{activeRide.fareAmount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Details Card (shows if status is ACCEPTED onwards) */}
            {activeRide.driverProfile ? (
              <div className="p-5 border rounded-2xl bg-white space-y-4 shadow-sm">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Car className="h-5 w-5 text-indigo-600" /> Driver Assigned
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 text-lg">
                    {activeRide.driverProfile.user?.name?.[0] || "D"}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-zinc-900">{activeRide.driverProfile.user?.name}</p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      {activeRide.driverProfile.averageRating} Rating
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-indigo-600" asChild>
                    <a href={`tel:${activeRide.driverProfile.user?.phone || ""}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                {activeRide.driverProfile.vehicle && (
                  <div className="bg-zinc-50 p-3 rounded-xl text-xs space-y-1">
                    <p className="text-zinc-500">Vehicle Assigned</p>
                    <p className="font-semibold text-zinc-800">
                      {activeRide.driverProfile.vehicle.color} {activeRide.driverProfile.vehicle.model}
                    </p>
                    <p className="font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 inline-block px-2 py-0.5 rounded mt-1">
                      {activeRide.driverProfile.vehicle.registrationNumber}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 border rounded-2xl bg-zinc-50 text-center text-sm text-zinc-500">
                🔍 Matching you with nearby verified campus drivers...
              </div>
            )}

            {/* Actions */}
            {["REQUESTED", "ACCEPTED", "DRIVER_ARRIVING"].includes(activeRide.status) && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 gap-2"
              >
                <XCircle className="h-4 w-4" /> {cancelling ? "Cancelling..." : "Cancel Ride Request"}
              </Button>
            )}

            {activeRide.status === "COMPLETED" && (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                asChild
              >
                <Link href="/passenger/payments">
                  <CheckCircle2 className="h-4 w-4" /> Complete Trip Payment
                </Link>
              </Button>
            )}
          </div>

          {/* Map View */}
          <div className="h-[450px] lg:h-auto min-h-[400px]">
            <LiveMap
              pickupLat={Number(activeRide.pickupLatitude || 28.545)}
              pickupLng={Number(activeRide.pickupLongitude || 77.192)}
              dropoffLat={Number(activeRide.dropoffLatitude || 28.546)}
              dropoffLng={Number(activeRide.dropoffLongitude || 77.1895)}
              driverLat={driverLat}
              driverLng={driverLng}
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
