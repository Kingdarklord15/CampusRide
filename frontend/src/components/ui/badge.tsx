import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "danger" | "muted" }) {
  const styles = {
    default: "bg-black text-white border border-black",
    success: "bg-white text-black border border-black font-semibold",
    warning: "bg-white text-black border border-black italic",
    danger: "bg-white text-black border border-black line-through font-semibold",
    muted: "bg-zinc-100 text-zinc-600 border border-zinc-250"
  };
  return <span className={cn("inline-flex items-center rounded-none px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase", styles[variant], className)} {...props} />;
}
