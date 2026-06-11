"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ShieldCheck, Coins, Calendar, ArrowLeft, ArrowUpRight } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useRides } from "@/hooks/use-queries";
import { driverService } from "@/services/driver.service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";

// Mock weekly chart data
const chartData = [
  { day: "Mon", earnings: 450 },
  { day: "Tue", earnings: 720 },
  { day: "Wed", earnings: 600 },
  { day: "Thu", earnings: 950 },
  { day: "Fri", earnings: 1200 },
  { day: "Sat", earnings: 800 },
  { day: "Sun", earnings: 300 }
];

export default function DriverEarningsPage() {
  const { data: profile } = useQuery({
    queryKey: ["driverProfile"],
    queryFn: driverService.me,
  });

  const { data: rides, isLoading } = useRides();

  // Filter rides matching this driver
  const myCompletedRides = rides?.filter((r) => r.driverProfile?.id === profile?.id && r.status === "COMPLETED") || [];

  return (
    <DashboardShell role="DRIVER">
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/driver/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900">Earnings & Payouts</h1>
            <p className="text-zinc-500">Analyze your weekly income streams and completed fares.</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-2xl bg-white flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Total Revenue</p>
              <h2 className="text-3xl font-extrabold text-indigo-600 mt-2">{formatCurrency(Number(profile?.totalEarnings || 0))}</h2>
              <p className="text-xs text-zinc-400 mt-1">Life-time operational value</p>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-650 rounded-2xl"><Coins className="h-6 w-6" /></div>
          </div>

          <div className="p-6 border rounded-2xl bg-white flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">This Week's Estimate</p>
              <h2 className="text-3xl font-extrabold text-emerald-600 mt-2">₹5,020</h2>
              <p className="text-xs text-zinc-400 mt-1">₹720 avg. daily earnings</p>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-650 rounded-2xl"><ArrowUpRight className="h-6 w-6" /></div>
          </div>

          <div className="p-6 border rounded-2xl bg-white flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Completed Trips</p>
              <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{profile?.totalRides || 0}</h2>
              <p className="text-xs text-zinc-400 mt-1">Verified passenger routes</p>
            </div>
            <div className="p-4 bg-zinc-100 text-zinc-650 rounded-2xl"><ShieldCheck className="h-6 w-6" /></div>
          </div>
        </div>

        {/* Charts */}
        <div className="p-6 border rounded-2xl bg-white shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-zinc-950">Weekly Earnings Curve</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="earnings" stroke="#4f46e5" fill="#c7d2fe" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earnings breakdown table */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-zinc-950">Fare Invoices</h3>
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-2xl" />
          ) : myCompletedRides.length > 0 ? (
            <div className="overflow-x-auto border border-zinc-100 rounded-2xl bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-150">
                  <tr>
                    <th className="p-4">Trip Date</th>
                    <th className="p-4">Passenger</th>
                    <th className="p-4">Route</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4 text-right">Fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {myCompletedRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-zinc-50/50">
                      <td className="p-4 text-zinc-500">{formatDate(ride.requestedAt)}</td>
                      <td className="p-4 font-semibold">{ride.passengerProfile?.user?.name || "Student"}</td>
                      <td className="p-4 text-xs text-zinc-700">{ride.pickupLocation} ➔ {ride.dropoffLocation}</td>
                      <td className="p-4 text-zinc-500 font-medium">
                        {ride.payment?.method?.replace("_", " ") || "CASH"}
                      </td>
                      <td className="p-4 text-right font-extrabold text-emerald-600">
                        {formatCurrency(ride.fareAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 border border-dashed rounded-2xl text-center text-zinc-500 text-sm bg-zinc-50/50">
              No completed ride fares processed.
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
