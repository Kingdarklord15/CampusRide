"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectItem = ({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) => (
  <SelectPrimitive.Item className={cn("cursor-pointer rounded-none px-3 py-2 text-sm outline-none hover:bg-black hover:text-white font-mono", className)} {...props} />
);
export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger className={cn("flex h-11 w-full items-center justify-between rounded-none border-2 border-black bg-white px-4 text-sm font-body shadow-none focus:outline-none focus-visible:outline-none focus:border-[3px]", className)} {...props}>
      {children}
      <ChevronDown className="h-4 w-4 opacity-100 text-black" />
    </SelectPrimitive.Trigger>
  );
}
export const SelectValue = SelectPrimitive.Value;
export function SelectContent({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn("z-50 min-w-[8rem] rounded-none border-2 border-black bg-white p-1 shadow-none", className)} {...props} />
    </SelectPrimitive.Portal>
  );
}
