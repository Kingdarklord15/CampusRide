"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List className={cn("inline-flex rounded-md bg-white/[0.03] border border-white/8 p-1", className)} {...props} />
);
export const TabsTrigger = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger className={cn("rounded-sm px-4 py-1.5 text-xs font-mono font-semibold tracking-wider uppercase text-zinc-400 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md", className)} {...props} />
);
export const TabsContent = TabsPrimitive.Content;
