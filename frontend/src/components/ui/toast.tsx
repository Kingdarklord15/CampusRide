"use client";

import { X } from "lucide-react";
import { useUiStore } from "@/store/ui.store";
import { Button } from "./button";

export function Toasts() {
  const toasts = useUiStore((state) => state.toasts);
  const dismiss = useUiStore((state) => state.dismissToast);
  return (
    <div className="fixed bottom-4 right-4 z-50 grid gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="flex min-w-72 items-start justify-between gap-3 rounded-md border border-white/8 bg-black/90 p-4 shadow-glass backdrop-blur-xl text-white transition-all duration-300">
          <div>
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description ? <p className="text-xs text-zinc-400 mt-1">{toast.description}</p> : null}
          </div>
          <Button size="icon" variant="ghost" className="text-white hover:bg-white/10" onClick={() => dismiss(toast.id)}><X className="h-4 w-4" /></Button>
        </div>
      ))}
    </div>
  );
}
