"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export function DialogContent({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300" />
      <DialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/8 bg-white/[0.03] p-6 shadow-glass backdrop-blur-xl transition-all duration-300 text-white focus:outline-none", className)} {...props} />
    </DialogPrimitive.Portal>
  );
}
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
