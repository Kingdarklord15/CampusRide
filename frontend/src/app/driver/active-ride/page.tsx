"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, CheckCircle, Navigation, Phone, User, Compass, Play } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LiveMap } from "@/components/map";
import { RideStatusTracker } from "@/components/cards/ride-status-tracker";
import { useRideStore } from "@/store/ride.store";
import { useRides } from "@/hooks/use-queries";
import { rideService } from "@/services/ride.service";
import { driverService } from "@/services/driver.service";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";

export default function DriverActiveRidePage() {
  const { activeRide, setActiveRide } = useRideStore();
  const { data: rides, refetch } = useRides();
  const [updating, setUpdating] = useState(false);
  const showToast = useUiStore((state) => state.toast);
  const router = useRouter();

  // Fetch driver profile
  const { data: profile } = useQuery({
    queryKey: ["driverProfile"],
    queryFn: driverService.me,
  });

  // Re-hydrate active ride on refresh
  useEffect(() => {
    if (rides && profile) {
      const active = rides.find(
        (r) =>
          r.driverProfile?.id === profile.id &&
          ["ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS"].includes(r.status)
      );
      if (active) setActiveRide(active);
    }
  }, [rides, profile, setActiveRide]);

  const updateStatus = async (action: "arriving" | "start" | "complete") => {
    if (!activeRide) return;
    setUpdating(true);
    try {
      let updated;
      if (action === "arriving") {
        updated = await rideService.arriving(activeRide.id);
        showToast({ title: "Status Updated", description: "Passenger notified that you have arrived.", type: "success" });
      } else if (action === "start") {
        updated = await rideService.start(activeRide.id);
        showToast({ title: "Ride Started", description: "Drive safely to the destination.", type: "success" });
      } else {
        updated = await rideService.complete(activeRide.id);
        showToast({ title: "Ride Completed", description: "Successfully finished trip. Earnings updated.", type: "success" });
        setActiveRide(null);
        refetch();
        router.push("/driver/dashboard");
        return;
      }
      setActiveRide(updated);
      refetch();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to update ride status";
      showToast({ title: "Update Failed", description: msg, type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  if (!activeRide) {
    return (
      <DashboardShell role="DRIVER">
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-zinc-50/50 min-h-[450px]">
          <Compass className="h-12 w-12 text-zinc-300 mb-4" />
          <h2 className="text-xl font-bold text-zinc-900">No active assignment</h2>
          <p className="text-sm text-zinc-500 max-w-sm text-center mt-2 mb-6">
            You don't have an active ride request assigned to you. Go online to receive passenger requests.
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/driver/ride-requests">Check Requests</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  // Driver positions
  let driverLat = undefined;
  let driverLng = undefined;
  if (activeRide.status === "ACCEPTED" || activeRide.status === "DRIVER_ARRIVING") {
    driverLat = Number(activeRide.pickupLatitude || 28.545) + 0.002;
    driverLng = Number(activeRide.pickupLongitude || 77.192) - 0.001;
  } else if (activeRide.status === "IN_PROGRESS") {
    const pLat = Number(activeRide.pickupLatitude || 28.545);
    const pLng = Number(activeRide.pickupLongitude || 77.192);
    const dLat = Number(activeRide.dropoffLatitude || 28.546);
    const dLng = Number(activeRide.dropoffLongitude || 77.1895);
    driverLat = (pLat + dLat) / 2;
    driverLng = (pLng + dLng) / 2;
  }

  return (
    <DashboardShell role="DRIVER">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/driver/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900">Active Assignment</h1>
            <p className="text-zinc-500">Coordinate and update travel steps for your passenger.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            <RideStatusTracker status={activeRide.status} />

            {/* Passenger Info */}
            <div className="p-5 border rounded-2xl bg-white space-y-4 shadow-sm">
              <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" /> Passenger Details
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                  {activeRide.passengerProfile?.user?.name?.[0] || "P"}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-900">{activeRide.passengerProfile?.user?.name || "Student"}</p>
                  <p className="text-xs text-zinc-500">University Student</p>
                </div>
                <Button variant="ghost" size="icon" className="text-indigo-600" asChild>
                  <a href={`tel:${activeRide.passengerProfile?.user?.phone || ""}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Route Summary */}
            <div className="p-5 border rounded-2xl bg-white space-y-3">
              <h3 className="font-bold text-zinc-900 border-b pb-2">Navigation Summary</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-zinc-500">Pickup Location</p>
                  <p className="font-semibold text-zinc-800 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    {activeRide.pickupLocation}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Dropoff Location</p>
                  <p className="font-semibold text-zinc-800 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    {activeRide.dropoffLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="space-y-3">
              {activeRide.status === "ACCEPTED" && (
                <Button
                  onClick={() => updateStatus("arriving")}
                  disabled={updating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 py-6 text-lg"
                >
                  <Navigation className="h-5 w-5" /> I Have Arrived
                </Button>
              )}

              {activeRide.status === "DRIVER_ARRIVING" && (
                <Button
                  onClick={() => updateStatus("start")}
                  disabled={updating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 py-6 text-lg"
                >
                  <Play className="h-5 w-5" /> Start Trip
                </Button>
              )}

              {activeRide.status === "IN_PROGRESS" && (
                <Button
                  onClick={() => updateStatus("complete")}
                  disabled={updating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 py-6 text-lg"
                >
                  <CheckCircle className="h-5 w-5" /> Complete Trip
                </Button>
              )}
            </div>
          </div>

          {/* Map Section */}
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
