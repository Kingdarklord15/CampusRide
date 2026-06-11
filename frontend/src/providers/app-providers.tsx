"use client";

import { QueryProvider } from "./query-provider";
import { SocketProvider } from "./socket-provider";
import { Toasts } from "@/components/ui/toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SocketProvider>
        {children}
        <Toasts />
      </SocketProvider>
    </QueryProvider>
  );
}
