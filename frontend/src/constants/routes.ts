import type { Role } from "@/types";

export const roleHome: Record<Role, string> = {
  PASSENGER: "/passenger/dashboard",
  DRIVER: "/driver/dashboard",
  ADMIN: "/admin/dashboard"
};

export const navItems = {
  PASSENGER: [
    ["Dashboard", "/passenger/dashboard"],
    ["Book Ride", "/passenger/book-ride"],
    ["Active Ride", "/passenger/active-ride"],
    ["History", "/passenger/history"],
    ["Payments", "/passenger/payments"],
    ["Profile", "/passenger/profile"],
    ["Settings", "/passenger/settings"]
  ],
  DRIVER: [
    ["Dashboard", "/driver/dashboard"],
    ["Requests", "/driver/ride-requests"],
    ["Active Ride", "/driver/active-ride"],
    ["History", "/driver/history"],
    ["Earnings", "/driver/earnings"],
    ["Profile", "/driver/profile"],
    ["Settings", "/driver/settings"]
  ],
  ADMIN: [
    ["Dashboard", "/admin/dashboard"],
    ["Users", "/admin/users"],
    ["Drivers", "/admin/drivers"],
    ["Rides", "/admin/rides"],
    ["Analytics", "/admin/analytics"],
    ["Settings", "/admin/settings"]
  ]
} as const;
