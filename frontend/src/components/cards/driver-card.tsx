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
            <p className="font-semibold">{driver.user?.name ?? "Driver"}</p>
            <p className="text-sm text-zinc-500">{driver.vehicle?.registrationNumber ?? driver.licenseNumber}</p>
            <p className="mt-2 flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{Number(driver.averageRating).toFixed(1)}</p>
          </div>
          <Badge variant={driver.status === "ONLINE" ? "success" : driver.status === "BUSY" ? "warning" : "muted"}>{driver.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
