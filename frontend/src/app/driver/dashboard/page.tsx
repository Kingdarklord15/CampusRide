"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Car, Star, DollarSign, SwitchCamera, ShieldAlert, CheckCircle2, UserCheck, Power } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AnalyticsCard } from "@/components/cards/analytics-card";
import { useRides } from "@/hooks/use-queries";
import { driverService } from "@/services/driver.service";
import { useDriverStore } from "@/store/driver.store";
import { useRideStore } from "@/store/ride.store";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function DriverDashboard() {
  const { status, setStatus } = useDriverStore();
  const { activeRide, setActiveRide } = useRideStore();
  const toast = useUiStore((state) => state.toast);

  // Fetch driver profile
  const { data: profile, isLoading: loadingProfile, refetch: refetchProfile } = useQuery({
    queryKey: ["driverProfile"],
    queryFn: driverService.me,
  });

  const { data: rides, isLoading: loadingRides } = useRides();

  // Align status with backend on mount
  useEffect(() => {
    if (profile) {
      setStatus(profile.status);
    }
  }, [profile, setStatus]);

  // Check for assigned active ride
  useEffect(() => {
    if (rides && profile) {
      const active = rides.find(
        (r) =>
          r.driverProfile?.id === profile.id &&
          ["ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS"].includes(r.status)
      );
      if (active) setActiveRide(active);
      else setActiveRide(null);
    }
  }, [rides, profile, setActiveRide]);

  const toggleStatus = async () => {
    const nextStatus = status === "ONLINE" ? "OFFLINE" : "ONLINE";
    try {
      await driverService.setStatus(nextStatus);
      setStatus(nextStatus);
      refetchProfile();
      toast({
        title: `You are now ${nextStatus.toLowerCase()}`,
        description: nextStatus === "ONLINE" ? "You will start receiving ride requests." : "Offline. You will not receive requests.",
        type: "success",
      });
    } catch (err: any) {
      toast({ title: "Status Change Failed", description: err.message, type: "error" });
    }
  };

  return (
    <DashboardShell role="DRIVER">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900">Driver Command Center</h1>
            <p className="text-zinc-500 font-medium">Toggle availability and manage active assignments.</p>
          </div>

          {/* Online/Offline Status Button */}
          <Button
            onClick={toggleStatus}
            className={`gap-2 py-6 px-6 font-bold text-md rounded-xl transition-all shadow-md ${
              status === "ONLINE"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse"
                : "bg-zinc-800 hover:bg-zinc-900 text-white"
            }`}
          >
            <Power className="h-5 w-5" />
            {status === "ONLINE" ? "ONLINE - Receiving Rides" : "OFFLINE - Go Online"}
          </Button>
        </div>

        {/* Verification Check */}
        {profile && !profile.verifiedAt && (
          <div className="p-4 border border-yellow-200 rounded-2xl bg-yellow-50 text-yellow-900 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-yellow-600" />
            <p className="text-sm">
              Your profile is undergoing admin verification. You cannot receive passenger requests until verified.
            </p>
          </div>
        )}

        {/* Active Assignment Alert */}
        {activeRide && (
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-indigo-50 border border-indigo-100 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-indigo-900">Active Ride Assignment</p>
                <p className="text-sm text-indigo-750">Passenger: {activeRide.passengerProfile?.user?.name || "Anonymous"} | {activeRide.pickupLocation} ➔ {activeRide.dropoffLocation}</p>
              </div>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0" asChild>
              <Link href="/driver/active-ride">Manage Active Ride</Link>
            </Button>
          </div>
        )}

        {/* Driver Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {loadingProfile ? (
            <>
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </>
          ) : (
            <>
              <AnalyticsCard
                title="Total Rides"
                value={profile?.totalRides || 0}
                icon={Car}
              />
              <AnalyticsCard
                title="Driver Rating"
                value={`${profile?.averageRating || "0.0"} / 5`}
                icon={Star}
              />
              <AnalyticsCard
                title="Total Earnings"
                value={formatCurrency(Number(profile?.totalEarnings || 0))}
                icon={DollarSign}
              />
            </>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-2xl bg-white space-y-4 shadow-sm">
            <h3 className="font-bold text-lg text-zinc-950 flex items-center gap-2">
              <SwitchCamera className="h-5 w-5 text-indigo-600" /> Incoming Demands
            </h3>
            <p className="text-sm text-zinc-500">
              Check out pending requests that you can accept or decline instantly.
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
              <Link href="/driver/ride-requests">View Ride Requests</Link>
            </Button>
          </div>

          <div className="p-6 border rounded-2xl bg-white space-y-4 shadow-sm">
            <h3 className="font-bold text-lg text-zinc-950 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-indigo-600" /> Vehicle Status
            </h3>
            <p className="text-sm text-zinc-500">
              Ensure your licensing and vehicle logs (E-rickshaw, Cart, or Shuttle) are active and verified.
            </p>
            <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" asChild>
              <Link href="/driver/profile">Manage Vehicle Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
