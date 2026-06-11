"use client";

import { Car, CheckCircle, IndianRupee, Route } from "lucide-react";
import { AnalyticsCard } from "@/components/cards/analytics-card";
import { DriverCard } from "@/components/cards/driver-card";
import { RideCard } from "@/components/cards/ride-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/state";
import { RideBookingForm } from "@/features/rides/ride-booking-form";
import { useAvailableDrivers, useRides } from "@/hooks/use-queries";
import { formatCurrency } from "@/lib/utils";

export function PassengerDashboard() {
  const rides = useRides();
  const drivers = useAvailableDrivers();
  if (rides.isError) return <ErrorState />;
  const data = rides.data ?? [];
  const completed = data.filter((ride) => ride.status === "COMPLETED");
  const active = data.find((ride) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(ride.status));
  const spent = completed.reduce((sum, ride) => sum + Number(ride.fareAmount ?? 0), 0);
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><AnalyticsCard title="Total rides" value={data.length} icon={Route} /><AnalyticsCard title="Active ride" value={active ? "Yes" : "None"} icon={Car} /><AnalyticsCard title="Completed" value={completed.length} icon={CheckCircle} /><AnalyticsCard title="Amount spent" value={formatCurrency(spent)} icon={IndianRupee} /></div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]"><Card><CardHeader><CardTitle>Recent rides</CardTitle></CardHeader><CardContent className="grid gap-3">{data.length ? data.slice(0, 5).map((ride) => <RideCard key={ride.id} ride={ride} />) : <EmptyState />}</CardContent></Card><Card><CardHeader><CardTitle>Quick booking</CardTitle></CardHeader><CardContent><RideBookingForm /></CardContent></Card></div>
      <Card><CardHeader><CardTitle>Driver availability</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{drivers.data?.length ? drivers.data.map((driver) => <DriverCard key={driver.id} driver={driver} />) : <EmptyState title="No drivers online" />}</CardContent></Card>
    </div>
  );
}
