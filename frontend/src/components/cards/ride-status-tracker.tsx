import type { RideStatus } from "@/types";
import { cn } from "@/lib/utils";

const steps: RideStatus[] = ["REQUESTED", "ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS", "COMPLETED"];

export function RideStatusTracker({ status }: { status: RideStatus }) {
  const current = steps.indexOf(status);
  return (
    <div className="grid gap-4 rounded-xl border border-white/8 bg-white/[0.03] p-6 shadow-glass backdrop-blur-xl">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <div className={cn("h-2.5 w-2.5 rounded-full transition-all duration-300", index <= current ? "bg-white shadow-md shadow-white/30" : "bg-white/10")} />
          <p className={cn("text-xs font-mono uppercase tracking-wider", index <= current ? "font-bold text-white" : "text-zinc-500")}>{step.replaceAll("_", " ")}</p>
        </div>
      ))}
      {status === "CANCELLED" ? <p className="text-xs font-bold font-mono uppercase tracking-wider text-rose-400 mt-2">Ride cancelled</p> : null}
    </div>
  );
}
