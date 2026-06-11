import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("h-11 w-full rounded-none border-2 border-black bg-white px-4 text-sm font-body text-black placeholder:text-zinc-500 placeholder:italic transition-all duration-100 focus:border-[3px] focus:border-black focus:outline-none disabled:opacity-50", className)} {...props} />
));
Input.displayName = "Input";
