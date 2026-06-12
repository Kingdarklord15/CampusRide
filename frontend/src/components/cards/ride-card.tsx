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
            <div className="grid gap-2 text-xs font-medium text-zinc-300">
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-white" />{ride.pickupLocation}</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-zinc-500" />{ride.dropoffLocation}</p>
            </div>
            <p className="text-[10px] font-mono text-zinc-500">{formatDate(ride.requestedAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-white">{formatCurrency(ride.fareAmount)}</p>
            {actions ? <div className="mt-4 flex gap-2 justify-end">{actions}</div> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
