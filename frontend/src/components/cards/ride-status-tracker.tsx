import type { RideStatus } from "@/types";
import { cn } from "@/lib/utils";

const steps: RideStatus[] = ["REQUESTED", "ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS", "COMPLETED"];

export function RideStatusTracker({ status }: { status: RideStatus }) {
  const current = steps.indexOf(status);
  return (
    <div className="grid gap-3 rounded-lg border bg-white p-5">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <div className={cn("h-3 w-3 rounded-full", index <= current ? "bg-indigo-600" : "bg-zinc-200")} />
          <p className={cn("text-sm", index <= current ? "font-medium text-slate-900" : "text-zinc-500")}>{step.replaceAll("_", " ")}</p>
        </div>
      ))}
      {status === "CANCELLED" ? <p className="text-sm font-medium text-rose-600">Ride cancelled</p> : null}
    </div>
  );
}
