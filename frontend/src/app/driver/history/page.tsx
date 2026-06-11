"use client";

import { useQuery } from "@tanstack/react-query";
import { Star, ShieldAlert, Calendar, MapPin, DollarSign } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useRides } from "@/hooks/use-queries";
import { driverService } from "@/services/driver.service";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/cards/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DriverHistoryPage() {
  const { data: profile } = useQuery({
    queryKey: ["driverProfile"],
    queryFn: driverService.me,
  });

  const { data: rides, isLoading } = useRides();

  // Filter rides matching this driver
  const myRides = rides?.filter((r) => r.driverProfile?.id === profile?.id) || [];

  return (
    <DashboardShell role="DRIVER">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Your Ride History</h1>
          <p className="text-zinc-500">View your completed rides, performance ratings, and earnings details.</p>
        </div>

        {/* History List */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ) : myRides.length > 0 ? (
          <div className="grid gap-4">
            {myRides.map((ride) => (
              <div key={ride.id} className="p-5 border rounded-2xl bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow animate-fade-in">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={ride.status} />
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(ride.requestedAt)}
                    </span>
                  </div>

                  <div className="grid gap-1.5 text-sm text-zinc-700">
                    <p className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-600" />
                      <span className="font-semibold">Pickup:</span> {ride.pickupLocation}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span className="font-semibold">Dropoff:</span> {ride.dropoffLocation}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-500">
                    Passenger: <span className="font-semibold text-zinc-700">{ride.passengerProfile?.user?.name || "Student"}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <span className="font-bold text-lg text-emerald-600">{formatCurrency(ride.fareAmount)}</span>
                  
                  {/* Rating display */}
                  {ride.status === "COMPLETED" && (
                    ride.rating ? (
                      <div className="flex items-center gap-1.5 text-yellow-500">
                        {Array.from({ length: Number(ride.rating.score) }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-500" />
                        ))}
                        <span className="text-xs text-zinc-500 ml-1">({ride.rating.score})</span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400 italic">No rating yet</span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-zinc-50/50">
            <ShieldAlert className="h-10 w-10 text-zinc-400 mb-3" />
            <p className="font-semibold text-zinc-700">No trips logged</p>
            <p className="text-sm text-zinc-500">You haven't completed any rides yet.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
