"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const rideData = [
  { name: "Mon", rides: 18, demand: 22 },
  { name: "Tue", rides: 24, demand: 28 },
  { name: "Wed", rides: 20, demand: 26 },
  { name: "Thu", rides: 32, demand: 35 },
  { name: "Fri", rides: 42, demand: 48 },
  { name: "Sat", rides: 26, demand: 31 }
];

export function RideTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={rideData}>
        <defs>
          <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" fontSize={10} tickLine={false} />
        <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={10} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255, 255, 255, 0.08)", borderRadius: "12px", color: "#ffffff" }} />
        <Area type="monotone" dataKey="rides" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorRides)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DriverActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={rideData}>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" fontSize={10} tickLine={false} />
        <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={10} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255, 255, 255, 0.08)", borderRadius: "12px", color: "#ffffff" }} />
        <Bar dataKey="rides" fill="#ffffff" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DemandTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={rideData}>
        <defs>
          <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.08}/>
            <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" fontSize={10} tickLine={false} />
        <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={10} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255, 255, 255, 0.08)", borderRadius: "12px", color: "#ffffff" }} />
        <Area type="monotone" dataKey="demand" stroke="#a1a1aa" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
