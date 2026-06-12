"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectItem = ({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) => (
  <SelectPrimitive.Item className={cn("cursor-pointer rounded-md px-3 py-2 text-sm outline-none hover:bg-white/10 hover:text-white text-zinc-300 font-mono transition-colors", className)} {...props} />
);
export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger className={cn("flex h-11 w-full items-center justify-between rounded-md border border-white/8 bg-white/[0.04] px-4 text-sm font-body text-white shadow-none focus:outline-none focus:border-white transition-all duration-300", className)} {...props}>
      {children}
      <ChevronDown className="h-4 w-4 opacity-60 text-white" />
    </SelectPrimitive.Trigger>
  );
}
export const SelectValue = SelectPrimitive.Value;
export function SelectContent({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn("z-50 min-w-[8rem] rounded-md border border-white/8 bg-black/90 p-1 shadow-lg backdrop-blur-xl", className)} {...props} />
    </SelectPrimitive.Portal>
  );
}
