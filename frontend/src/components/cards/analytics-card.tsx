import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AnalyticsCard({ title, value, icon: Icon, hint }: { title: string; value: string | number; icon: LucideIcon; hint?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-[10px] font-mono tracking-wider uppercase font-semibold text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-white">{value}</p>
          {hint ? <p className="mt-1 text-[10px] text-zinc-500">{hint}</p> : null}
        </div>
        <div className="rounded-lg bg-white/5 p-3 text-white border border-white/5"><Icon className="h-5 w-5" /></div>
      </CardContent>
    </Card>
  );
}
