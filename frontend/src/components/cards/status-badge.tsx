import { Badge } from "@/components/ui/badge";
import type { RideStatus } from "@/types";

const map: Record<RideStatus, "default" | "success" | "warning" | "danger" | "muted"> = {
  REQUESTED: "warning",
  ACCEPTED: "default",
  DRIVER_ARRIVING: "default",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  CANCELLED: "danger",
  REJECTED: "muted"
};

export function StatusBadge({ status }: { status: RideStatus }) {
  return <Badge variant={map[status]}>{status.replaceAll("_", " ")}</Badge>;
}
