export const queryKeys = {
  me: ["auth", "me"] as const,
  drivers: ["drivers"] as const,
  availableDrivers: ["drivers", "available"] as const,
  rides: ["rides"] as const,
  rideDetails: (id: string) => ["rides", id] as const,
  notifications: ["notifications"] as const,
  payments: ["payments"] as const,
  analyticsOverview: ["analytics", "overview"] as const,
  analyticsRides: ["analytics", "rides"] as const,
  analyticsDrivers: ["analytics", "drivers"] as const,
  analyticsDemand: ["analytics", "demand"] as const
};
