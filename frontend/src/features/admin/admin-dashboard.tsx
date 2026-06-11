"use client";

import { Car, IndianRupee, Route, Users } from "lucide-react";
import { AnalyticsCard } from "@/components/cards/analytics-card";
import { DemandTrendsChart, DriverActivityChart, RideTrendsChart } from "@/components/charts/dashboard-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsOverview, useDrivers, useRides, useUsers } from "@/hooks/use-queries";
import { formatCurrency } from "@/lib/utils";

export function AdminDashboard() {
  useAnalyticsOverview();
  const users = useUsers();
  const drivers = useDrivers();
  const rides = useRides();
  const revenue = (rides.data ?? []).reduce((sum, ride) => sum + Number(ride.fareAmount ?? 0), 0);
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><AnalyticsCard title="Total users" value={users.data?.length ?? 0} icon={Users} /><AnalyticsCard title="Active drivers" value={drivers.data?.filter((d) => d.status === "ONLINE").length ?? 0} icon={Car} /><AnalyticsCard title="Active rides" value={rides.data?.filter((r) => ["REQUESTED", "ACCEPTED", "IN_PROGRESS"].includes(r.status)).length ?? 0} icon={Route} /><AnalyticsCard title="Revenue" value={formatCurrency(revenue)} icon={IndianRupee} /></div>
      <div className="grid gap-6 xl:grid-cols-3"><Card><CardHeader><CardTitle>Ride trends</CardTitle></CardHeader><CardContent><RideTrendsChart /></CardContent></Card><Card><CardHeader><CardTitle>Driver activity</CardTitle></CardHeader><CardContent><DriverActivityChart /></CardContent></Card><Card><CardHeader><CardTitle>Demand trends</CardTitle></CardHeader><CardContent><DemandTrendsChart /></CardContent></Card></div>
    </div>
  );
}
