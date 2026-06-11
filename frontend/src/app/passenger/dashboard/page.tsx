"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Clock, ShieldAlert, Car } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AnalyticsCard } from "@/components/cards/analytics-card";
import { RideCard } from "@/components/cards/ride-card";
import { useRides } from "@/hooks/use-queries";
import { useRideStore } from "@/store/ride.store";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function PassengerDashboard() {
  const { data: rides, isLoading, error } = useRides();
  const { activeRide, setActiveRide } = useRideStore();
  const router = useRouter();
  const toast = useUiStore((state) => state.toast);

  useEffect(() => {
    if (rides) {
      const active = rides.find((r) =>
        ["REQUESTED", "ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS"].includes(r.status)
      );
      if (active) {
        setActiveRide(active);
      } else {
        setActiveRide(null);
      }
    }
  }, [rides, setActiveRide]);

  // Calculate statistics
  const completedRides = rides?.filter((r) => r.status === "COMPLETED") || [];
  const totalRidesCount = completedRides.length;
  const totalSpent = completedRides.reduce((acc, r) => acc + Number(r.fareAmount || 0), 0);
  const averageFare = totalRidesCount > 0 ? totalSpent / totalRidesCount : 0;

  return (
    <DashboardShell role="PASSENGER">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900">Passenger Dashboard</h1>
            <p className="text-zinc-500">Book campus rides, check status, and review history.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" asChild>
            <Link href="/passenger/book-ride">
              <Navigation className="h-4 w-4" /> Book a New Ride
            </Link>
          </Button>
        </div>

        {/* Active Ride Notification Alert */}
        {activeRide && (
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-indigo-50 border border-indigo-100 sm:flex-row sm:items-center sm:justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-indigo-900">You have an active ride request!</p>
                <p className="text-sm text-indigo-700">Status: {activeRide.status.replaceAll("_", " ")}</p>
              </div>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0" asChild>
              <Link href="/passenger/active-ride">Track Active Ride</Link>
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {isLoading ? (
            <>
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </>
          ) : (
            <>
              <AnalyticsCard title="Total Rides" value={totalRidesCount} icon={Car} />
              <AnalyticsCard title="Total Spent" value={formatCurrency(totalSpent)} icon={Navigation} />
              <AnalyticsCard title="Avg. Ride Fare" value={formatCurrency(averageFare)} icon={Clock} />
            </>
          )}
        </div>

        {/* Recent Rides Table */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : rides && rides.length > 0 ? (
            <div className="grid gap-4">
              {rides.slice(0, 5).map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  actions={
                    ["REQUESTED", "ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS"].includes(ride.status) ? (
                      <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" asChild>
                        <Link href="/passenger/active-ride">Track</Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" asChild>
                        <Link href="/passenger/history">View Details</Link>
                      </Button>
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-zinc-50/50">
              <ShieldAlert className="h-10 w-10 text-zinc-400 mb-3" />
              <p className="font-semibold text-zinc-700">No rides booked yet</p>
              <p className="text-sm text-zinc-500 mb-4">Request your first CampusRide transport now.</p>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                <Link href="/passenger/book-ride">Book a Ride</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
