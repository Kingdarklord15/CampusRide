"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const LiveMap = dynamic(
  () => import("./map-component"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[350px] rounded-2xl flex items-center justify-center bg-zinc-150 text-zinc-500 font-semibold animate-pulse">
        Loading Map Visuals...
      </div>
    )
  }
);
