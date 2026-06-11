export type Role = "PASSENGER" | "DRIVER" | "ADMIN";
export type DriverStatus = "ONLINE" | "OFFLINE" | "BUSY" | "SUSPENDED";
export type RideStatus = "REQUESTED" | "ACCEPTED" | "DRIVER_ARRIVING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "REJECTED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
};

export type DriverProfile = {
  id: string;
  userId: string;
  licenseNumber: string;
  status: DriverStatus;
  averageRating: string | number;
  totalRides: number;
  totalEarnings: string | number;
  verifiedAt?: string | null;
  user?: User;
  vehicle?: Vehicle | null;
};

export type Vehicle = {
  id: string;
  registrationNumber: string;
  vehicleType: "E_RICKSHAW" | "CART" | "SHUTTLE";
  model?: string | null;
  color?: string | null;
  capacity: number;
  isActive: boolean;
};

export type Rating = {
  id: string;
  rideId: string;
  passengerUserId: string;
  driverProfileId: string;
  score: number;
  comment?: string | null;
  createdAt: string;
};

export type Ride = {
  id: string;
  pickupLocation: string;
  pickupLatitude?: string | number | null;
  pickupLongitude?: string | number | null;
  dropoffLocation: string;
  dropoffLatitude?: string | number | null;
  dropoffLongitude?: string | number | null;
  status: RideStatus;
  fareAmount?: string | number | null;
  distanceKm?: string | number | null;
  requestedAt: string;
  completedAt?: string | null;
  passengerProfile?: { user?: User };
  driverProfile?: DriverProfile | null;
  payment?: Payment | null;
  rating?: Rating | null;
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  readAt?: string | null;
  createdAt: string;
};

export type Payment = {
  id: string;
  rideId: string;
  amount: string | number;
  currency: string;
  method: string;
  status: PaymentStatus;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
