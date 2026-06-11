"use client";

import { useState } from "react";
import { Search, Compass, Eye, ShieldAlert, XOctagon } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useRides } from "@/hooks/use-queries";
import { rideService } from "@/services/ride.service";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/cards/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminRidesPage() {
  const { data: rides, isLoading, refetch } = useRides();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const showToast = useUiStore((state) => state.toast);

  const handleAdminCancel = async (rideId: string) => {
    try {
      await rideService.cancel(rideId, "Administrative cancellation override");
      showToast({ title: "Admin Override Successful", description: "Trip has been administratively cancelled.", type: "success" });
      refetch();
    } catch (err: any) {
      showToast({ title: "Failed to Cancel", description: err.message, type: "error" });
    }
  };

  const filteredRides = rides?.filter((r) => {
    const matchesSearch =
      r.pickupLocation.toLowerCase().includes(search.toLowerCase()) ||
      r.dropoffLocation.toLowerCase().includes(search.toLowerCase()) ||
      (r.passengerProfile?.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.driverProfile?.user?.name || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <DashboardShell role="ADMIN">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Platform Rides Monitor</h1>
          <p className="text-zinc-500">View real-time logs of transit bookings and apply admin overrides.</p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 border rounded-2xl shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by locations or names..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["ALL", "REQUESTED", "ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  statusFilter === st
                    ? "bg-indigo-650 text-white border-indigo-600"
                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Rides logs table */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ) : filteredRides.length > 0 ? (
          <div className="overflow-x-auto border border-zinc-100 rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-550 border-b">
                <tr>
                  <th className="p-4">Passenger / Driver</th>
                  <th className="p-4">Route Info</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Time requested</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredRides.map((ride) => {
                  const isActive = ["REQUESTED", "ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS"].includes(ride.status);
                  return (
                    <tr key={ride.id} className="hover:bg-zinc-50/50">
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-zinc-900">{ride.passengerProfile?.user?.name}</p>
                          <p className="text-xs text-zinc-400">Driver: {ride.driverProfile?.user?.name || "Assigning..."}</p>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-zinc-700">
                        <p><span className="font-semibold text-indigo-755">P:</span> {ride.pickupLocation}</p>
                        <p className="mt-1"><span className="font-semibold text-emerald-755">D:</span> {ride.dropoffLocation}</p>
                      </td>
                      <td className="p-4 text-xs">
                        <p>Fare: <span className="font-bold text-zinc-800">{formatCurrency(ride.fareAmount)}</span></p>
                        <p className="text-zinc-400">{ride.distanceKm} km</p>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={ride.status} />
                      </td>
                      <td className="p-4 text-xs text-zinc-550">{formatDate(ride.requestedAt)}</td>
                      <td className="p-4 text-right">
                        {isActive ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAdminCancel(ride.id)}
                            className="text-rose-600 hover:bg-rose-50 text-xs gap-1.5"
                          >
                            <XOctagon className="h-4 w-4" /> Cancel Trip
                          </Button>
                        ) : (
                          <span className="text-xs text-zinc-400 italic">No override required</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-zinc-50/50">
            <ShieldAlert className="h-10 w-10 text-zinc-400 mb-3" />
            <p className="font-semibold text-zinc-700">No matching ride logs</p>
            <p className="text-sm text-zinc-500">Try modifying your search criteria.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
