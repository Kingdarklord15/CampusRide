"use client";

import { CheckCircle, IndianRupee, Route, Star } from "lucide-react";
import { AnalyticsCard } from "@/components/cards/analytics-card";
import { RideCard } from "@/components/cards/ride-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/state";
import { useRides } from "@/hooks/use-queries";
import { driverService } from "@/services/driver.service";
import { useDriverStore } from "@/store/driver.store";
import { formatCurrency } from "@/lib/utils";

export function DriverDashboard() {
  const rides = useRides();
  const status = useDriverStore((state) => state.status);
  const setStatus = useDriverStore((state) => state.setStatus);
  const data = rides.data ?? [];
  const completed = data.filter((ride) => ride.status === "COMPLETED");
  const earnings = completed.reduce((sum, ride) => sum + Number(ride.fareAmount ?? 0), 0);
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.03] p-5 shadow-glass backdrop-blur-xl">
        <div>
          <p className="font-extrabold text-white">Driver availability</p>
          <p className="text-xs text-zinc-400 mt-1">Current status: <span className="font-mono text-white font-semibold">{status}</span></p>
        </div>
        <Button variant={status === "ONLINE" ? "secondary" : "default"} onClick={async () => { const next = status === "ONLINE" ? "OFFLINE" : "ONLINE"; await driverService.setStatus(next); setStatus(next); }}>{status === "ONLINE" ? "Go offline" : "Go online"}</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><AnalyticsCard title="Total rides" value={data.length} icon={Route} /><AnalyticsCard title="Completed" value={completed.length} icon={CheckCircle} /><AnalyticsCard title="Earnings" value={formatCurrency(earnings)} icon={IndianRupee} /><AnalyticsCard title="Rating" value="4.8" icon={Star} /></div>
      <div className="grid gap-6 xl:grid-cols-2"><Card><CardHeader><CardTitle>Pending requests</CardTitle></CardHeader><CardContent className="grid gap-3">{data.filter((ride) => ride.status === "REQUESTED").length ? data.filter((ride) => ride.status === "REQUESTED").map((ride) => <RideCard key={ride.id} ride={ride} />) : <EmptyState />}</CardContent></Card><Card><CardHeader><CardTitle>Active ride</CardTitle></CardHeader><CardContent>{data.find((ride) => ["ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS"].includes(ride.status)) ? <RideCard ride={data.find((ride) => ["ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS"].includes(ride.status))!} /> : <EmptyState />}</CardContent></Card></div>
    </div>
  );
}
