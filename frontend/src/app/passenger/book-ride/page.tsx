"use client";


import { connectSocket } from "@/lib/socket";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, ArrowRight, DollarSign, Milestone } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LiveMap } from "@/components/map";
import { useCreateRide } from "@/hooks/use-queries";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CampusHotspot = {
  name: string;
  lat: number;
  lng: number;
};

const HOTSPOTS: CampusHotspot[] = [
  { name: "Main Gate", lat: 28.5485, lng: 77.1905 },
  { name: "Central Library", lat: 28.5450, lng: 77.1926 },
  { name: "Hostel Blocks", lat: 28.5412, lng: 77.1910 },
  { name: "Academic Block 1", lat: 28.5440, lng: 77.1945 },
  { name: "Sports Center", lat: 28.5460, lng: 77.1895 },
];

export default function BookRidePage() {
  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropoff, setDropoff] = useState("");
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(null);

  const [distance, setDistance] = useState<number | null>(null);
  const [fare, setFare] = useState<number | null>(null);

  const createRide = useCreateRide();
  const showToast = useUiStore((state) => state.toast);
  const router = useRouter();

  // Dynamic Fare & Distance calculation based on lat/lng coordinate differences
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const [lat1, lng1] = pickupCoords;
      const [lat2, lng2] = dropoffCoords;
      const dx = lat1 - lat2;
      const dy = lng1 - lng2;
      const dist = Math.sqrt(dx * dx + dy * dy) * 111.32; // Approx distance in km
      const calculatedDistance = parseFloat(dist.toFixed(2));
      const calculatedFare = Math.max(30, Math.round(calculatedDistance * 20)); // Base fare ₹30 + ₹20/km

      setDistance(calculatedDistance);
      setFare(calculatedFare);
    } else {
      setDistance(null);
      setFare(null);
    }
  }, [pickupCoords, dropoffCoords]);

  const selectHotspot = (type: "pickup" | "dropoff", spot: CampusHotspot) => {
    if (type === "pickup") {
      setPickup(spot.name);
      setPickupCoords([spot.lat, spot.lng]);
    } else {
      setDropoff(spot.name);
      setDropoffCoords([spot.lat, spot.lng]);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff) {
      showToast({ title: "Booking Error", description: "Pickup and Dropoff locations are required", type: "error" });
      return;
    }

    // Default to Center Campus coords if no custom coords selected
    const pCoords = pickupCoords || [28.545, 77.192];
    const dCoords = dropoffCoords || [28.546, 77.1895];

    try {
      const res = await createRide.mutateAsync({
        pickupLocation: pickup,
        pickupLatitude: pCoords[0],
        pickupLongitude: pCoords[1],
        dropoffLocation: dropoff,
        dropoffLatitude: dCoords[0],
        dropoffLongitude: dCoords[1],
        fareAmount: fare || 30,
        distanceKm: distance || 0.8,
      });

      const socket = connectSocket();

      console.log("Ride created:", res.id);
      console.log("Socket connected:", socket.connected);

      socket.emit("ride:requested", res.id);

      console.log("ride:requested emitted");
      showToast({ title: "Ride Requested!", description: "Waiting for an online driver to accept.", type: "success" });
      router.push("/passenger/active-ride");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to book ride";
      showToast({ title: "Booking Failed", description: msg, type: "error" });
    }
  };

  return (
    <DashboardShell role="PASSENGER">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        {/* Form Panel */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900">Book Campus Ride</h1>
            <p className="text-zinc-500">Choose hotspots or type location coordinates.</p>
          </div>

          <form onSubmit={handleBook} className="space-y-5">
            {/* Pickup Location */}
            <div className="space-y-2">
              <Label htmlFor="pickup">Pickup Location</Label>
              <Input
                id="pickup"
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  setPickupCoords(null);
                }}
                placeholder="Enter pickup hotspot"
                required
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {HOTSPOTS.map((spot) => (
                  <button
                    key={`pickup-${spot.name}`}
                    type="button"
                    onClick={() => selectHotspot("pickup", spot)}
                    className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2 py-1 rounded-md"
                  >
                    + {spot.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropoff Location */}
            <div className="space-y-2">
              <Label htmlFor="dropoff">Dropoff Location</Label>
              <Input
                id="dropoff"
                value={dropoff}
                onChange={(e) => {
                  setDropoff(e.target.value);
                  setDropoffCoords(null);
                }}
                placeholder="Enter destination hotspot"
                required
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {HOTSPOTS.map((spot) => (
                  <button
                    key={`dropoff-${spot.name}`}
                    type="button"
                    onClick={() => selectHotspot("dropoff", spot)}
                    className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2 py-1 rounded-md"
                  >
                    + {spot.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Fare Summary */}
            {distance !== null && fare !== null && (
              <div className="p-4 bg-zinc-50 border rounded-xl grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Milestone className="h-5 w-5 text-indigo-600 mb-1" />
                  <p className="text-xs text-zinc-500">Est. Distance</p>
                  <p className="font-bold text-lg text-zinc-950">{distance} km</p>
                </div>
                <div className="flex flex-col items-center">
                  <DollarSign className="h-5 w-5 text-emerald-600 mb-1" />
                  <p className="text-xs text-zinc-500">Est. Fare</p>
                  <p className="font-bold text-lg text-zinc-950">₹{fare}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 py-6 text-lg"
              disabled={createRide.isPending}
            >
              {createRide.isPending ? "Requesting ride..." : "Confirm Request"} <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Map View */}
        <div className="h-[500px] lg:h-auto min-h-[450px]">
          <LiveMap
            pickupLat={pickupCoords?.[0]}
            pickupLng={pickupCoords?.[1]}
            dropoffLat={dropoffCoords?.[0]}
            dropoffLng={dropoffCoords?.[1]}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
