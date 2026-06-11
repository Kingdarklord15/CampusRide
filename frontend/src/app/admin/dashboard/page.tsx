"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Car, Map, DollarSign, Eye, ShieldCheck, PlayCircle } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AnalyticsCard } from "@/components/cards/analytics-card";
import { RideTrendsChart } from "@/components/charts/dashboard-charts";
import { useRides, useDrivers, useAnalyticsOverview } from "@/hooks/use-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/cards/status-badge";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data: rides, isLoading: loadingRides } = useRides();
  const { data: drivers, isLoading: loadingDrivers } = useDrivers();
  const { data: overview, isLoading: loadingOverview } = useAnalyticsOverview();

  // Platform operational metrics
  const activeRides = rides?.filter((r) => ["REQUESTED", "ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS"].includes(r.status)) || [];
  const activeRidesCount = activeRides.length;

  const onlineDrivers = drivers?.filter((d) => d.status === "ONLINE") || [];
  const onlineDriversCount = onlineDrivers.length;

  const totalEarnings = rides?.filter((r) => r.status === "COMPLETED").reduce((acc, r) => acc + Number(r.fareAmount || 0), 0) || 0;

  return (
    <DashboardShell role="ADMIN">
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Campus Operations Center</h1>
          <p className="text-zinc-500">Monitor active transits, driver credentials, and platform billing metrics.</p>
        </div>

        {/* Operational Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loadingRides || loadingDrivers ? (
            <>
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </>
          ) : (
            <>
              <AnalyticsCard title="Active Trips" value={activeRidesCount} icon={PlayCircle} hint="Real-time transit assignments" />
              <AnalyticsCard title="Online Drivers" value={onlineDriversCount} icon={Car} hint="Active availability channels" />
              <AnalyticsCard title="Total Platform Earnings" value={formatCurrency(totalEarnings)} icon={DollarSign} hint="Processed campus fares" />
              <AnalyticsCard title="Total Drivers" value={drivers?.length || 0} icon={Users} hint="Registered operational drivers" />
            </>
          )}
        </div>

        {/* Charts & Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 border rounded-2xl bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-zinc-950">Daily Volume Analytics</h3>
            <RideTrendsChart />
          </div>
          <div className="p-6 border rounded-2xl bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-zinc-950">Active Drivers Roster</h3>
            {onlineDrivers.length > 0 ? (
              <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2">
                {onlineDrivers.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 border-b pb-2 last:border-0">
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
                      {d.user?.name?.[0] || "D"}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-xs text-zinc-900">{d.user?.name}</p>
                      <p className="text-[10px] text-indigo-650 bg-indigo-50 font-mono inline-block px-1 rounded">
                        {d.vehicle?.registrationNumber || "NO VEHICLE"}
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-zinc-400 min-h-[220px]">
                No drivers online right now.
              </div>
            )}
          </div>
        </div>

        {/* Live Active Trips Table */}
        <div className="p-6 border rounded-2xl bg-white shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-zinc-950">Ongoing Trips Monitor</h3>
          {activeRides.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 border-b">
                  <tr>
                    <th className="p-3">Passenger</th>
                    <th className="p-3">Driver</th>
                    <th className="p-3">Pickup</th>
                    <th className="p-3">Dropoff</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {activeRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-zinc-50/50">
                      <td className="p-3 font-semibold">{ride.passengerProfile?.user?.name || "Student"}</td>
                      <td className="p-3">{ride.driverProfile?.user?.name || "Assigning..."}</td>
                      <td className="p-3 text-zinc-500">{ride.pickupLocation}</td>
                      <td className="p-3 text-zinc-500">{ride.dropoffLocation}</td>
                      <td className="p-3">
                        <StatusBadge status={ride.status} />
                      </td>
                      <td className="p-3 text-right font-bold text-zinc-900">₹{ride.fareAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-zinc-400">
              No active transits on campus.
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
