import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DriverProfile } from "@/types";
import { Badge } from "@/components/ui/badge";

export function DriverCard({ driver }: { driver: DriverProfile }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-extrabold text-white">{driver.user?.name ?? "Driver"}</p>
            <p className="text-xs text-zinc-400 font-mono mt-1">{driver.vehicle?.registrationNumber ?? driver.licenseNumber}</p>
            <p className="mt-3 flex items-center gap-1 text-xs text-zinc-300 font-semibold">
              <Star className="h-3.5 w-3.5 fill-white text-white" />
              {Number(driver.averageRating).toFixed(1)}
            </p>
          </div>
          <Badge variant={driver.status === "ONLINE" ? "success" : driver.status === "BUSY" ? "warning" : "muted"}>{driver.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
