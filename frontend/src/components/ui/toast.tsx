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
        <div key={toast.id} className="flex min-w-72 items-start justify-between gap-3 rounded-lg border bg-white p-4 shadow-soft">
          <div>
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description ? <p className="text-sm text-zinc-500">{toast.description}</p> : null}
          </div>
          <Button size="icon" variant="ghost" onClick={() => dismiss(toast.id)}><X className="h-4 w-4" /></Button>
        </div>
      ))}
    </div>
  );
}
