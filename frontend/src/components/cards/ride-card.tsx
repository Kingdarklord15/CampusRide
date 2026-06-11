import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Ride } from "@/types";
import { StatusBadge } from "./status-badge";

export function RideCard({ ride, actions }: { ride: Ride; actions?: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-3">
            <StatusBadge status={ride.status} />
            <div className="grid gap-2 text-sm">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-600" />{ride.pickupLocation}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-600" />{ride.dropoffLocation}</p>
            </div>
            <p className="text-xs text-zinc-500">{formatDate(ride.requestedAt)}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(ride.fareAmount)}</p>
            {actions ? <div className="mt-4 flex gap-2">{actions}</div> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
