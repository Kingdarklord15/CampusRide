import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("h-11 w-full rounded-md border border-white/8 bg-white/[0.04] px-4 text-sm font-body text-white placeholder:text-zinc-500 transition-all duration-300 focus:border-white focus:outline-none disabled:opacity-50", className)} {...props} />
));
Input.displayName = "Input";
