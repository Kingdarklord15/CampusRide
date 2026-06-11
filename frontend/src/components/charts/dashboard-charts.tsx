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
  return <ResponsiveContainer width="100%" height={260}><AreaChart data={rideData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey="rides" stroke="#4f46e5" fill="#c7d2fe" /></AreaChart></ResponsiveContainer>;
}

export function DriverActivityChart() {
  return <ResponsiveContainer width="100%" height={260}><BarChart data={rideData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="rides" fill="#4f46e5" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>;
}

export function DemandTrendsChart() {
  return <ResponsiveContainer width="100%" height={260}><AreaChart data={rideData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey="demand" stroke="#059669" fill="#bbf7d0" /></AreaChart></ResponsiveContainer>;
}
