"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rideSchema } from "@/validations/ride.schema";
import { useCreateRide } from "@/hooks/use-queries";
import { useUiStore } from "@/store/ui.store";
import type { z } from "zod";

export function RideBookingForm() {
  const mutation = useCreateRide();
  const toast = useUiStore((state) => state.toast);
  const form = useForm<z.infer<typeof rideSchema>>({ resolver: zodResolver(rideSchema), defaultValues: { pickupLocation: "", dropoffLocation: "", fareAmount: 25, distanceKm: 1 } });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values, { onSuccess: () => toast({ title: "Ride requested", description: "Nearby drivers have been notified." }) }))}>
      <div className="grid gap-2"><Label>Pickup</Label><Input placeholder="Main gate" {...form.register("pickupLocation")} /></div>
      <div className="grid gap-2"><Label>Destination</Label><Input placeholder="Library block" {...form.register("dropoffLocation")} /></div>
      <div className="grid gap-2 sm:grid-cols-2"><div className="grid gap-2"><Label>Fare</Label><Input type="number" {...form.register("fareAmount")} /></div><div className="grid gap-2"><Label>Distance</Label><Input type="number" step="0.1" {...form.register("distanceKm")} /></div></div>
      <Button disabled={mutation.isPending}>{mutation.isPending ? "Requesting..." : "Request ride"}</Button>
    </form>
  );
}
