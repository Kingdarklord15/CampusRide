"use client";

import { useState } from "react";
import { Search, ShieldAlert, CheckCircle, Ban, ArrowLeft, Star, Car } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useDrivers } from "@/hooks/use-queries";
import { driverService } from "@/services/driver.service";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDriversPage() {
  const { data: drivers, isLoading, refetch } = useDrivers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const showToast = useUiStore((state) => state.toast);

  const handleVerify = async (driverId: string) => {
    try {
      await driverService.verify(driverId);
      showToast({ title: "Driver Verified", description: "Driver commercial license approved.", type: "success" });
      refetch();
    } catch (err: any) {
      showToast({ title: "Failed to Verify", description: err.message, type: "error" });
    }
  };

  const handleSuspend = async (driverId: string) => {
    try {
      await driverService.suspend(driverId);
      showToast({ title: "Driver Suspended", description: "Driver status marked as suspended.", type: "info" });
      refetch();
    } catch (err: any) {
      showToast({ title: "Failed to Suspend", description: err.message, type: "error" });
    }
  };

  // Filters based on search licensing/name and statuses
  const filteredDrivers = drivers?.filter((d) => {
    const matchesSearch =
      d.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "VERIFIED" && d.verifiedAt) ||
      (statusFilter === "UNVERIFIED" && !d.verifiedAt) ||
      d.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <DashboardShell role="ADMIN">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Driver Credentials & Approvals</h1>
          <p className="text-zinc-500">Audit commercial licenses, approve registrations, and manage suspensions.</p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 border rounded-2xl shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or license..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["ALL", "VERIFIED", "UNVERIFIED", "ONLINE", "OFFLINE", "BUSY", "SUSPENDED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  statusFilter === st
                    ? "bg-indigo-650 text-white border-indigo-600"
                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Drivers Grid / Table */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ) : filteredDrivers.length > 0 ? (
          <div className="overflow-x-auto border border-zinc-100 rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-550 border-b">
                <tr>
                  <th className="p-4">Driver Name</th>
                  <th className="p-4">License Code</th>
                  <th className="p-4">Vehicle Specs</th>
                  <th className="p-4">Avg. Rating</th>
                  <th className="p-4">Avail. Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredDrivers.map((d) => (
                  <tr key={d.id} className="hover:bg-zinc-50/50">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-zinc-900">{d.user?.name}</p>
                        <p className="text-xs text-zinc-400">{d.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-zinc-700">{d.licenseNumber}</td>
                    <td className="p-4">
                      {d.vehicle ? (
                        <div className="text-xs">
                          <p className="font-semibold text-zinc-800">{d.vehicle.color} {d.vehicle.model}</p>
                          <p className="font-mono text-indigo-600">{d.vehicle.registrationNumber}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 italic">No vehicle logged</span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-zinc-700 flex items-center gap-1 mt-4">
                      <Star className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500 shrink-0" />
                      {d.averageRating}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        d.status === "ONLINE"
                          ? "bg-emerald-50 text-emerald-700"
                          : d.status === "BUSY"
                          ? "bg-amber-50 text-amber-700"
                          : d.status === "SUSPENDED"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {!d.verifiedAt ? (
                        <Button
                          size="sm"
                          onClick={() => handleVerify(d.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </Button>
                      ) : d.status !== "SUSPENDED" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSuspend(d.id)}
                          className="text-rose-600 hover:bg-rose-50 text-xs gap-1.5"
                        >
                          <Ban className="h-3.5 w-3.5" /> Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleVerify(d.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                        >
                          Un-Suspend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-zinc-50/50">
            <ShieldAlert className="h-10 w-10 text-zinc-400 mb-3" />
            <p className="font-semibold text-zinc-700">No driver profiles matched</p>
            <p className="text-sm text-zinc-500">Try modifying your credential search filters.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
