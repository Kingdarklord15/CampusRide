import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "danger" | "muted" }) {
  const styles = {
    default: "bg-white/10 text-white border border-white/10",
    success: "bg-emerald-950/25 text-emerald-300 border border-emerald-500/20 font-semibold",
    warning: "bg-amber-950/25 text-amber-300 border border-amber-500/20",
    danger: "bg-rose-950/25 text-rose-300 border border-rose-500/20 font-semibold",
    muted: "bg-white/5 text-zinc-400 border border-white/5"
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase", styles[variant], className)} {...props} />;
}
