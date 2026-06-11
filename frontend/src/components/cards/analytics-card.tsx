import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AnalyticsCard({ title, value, icon: Icon, hint }: { title: string; value: string | number; icon: LucideIcon; hint?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
          {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
        </div>
        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600"><Icon className="h-5 w-5" /></div>
      </CardContent>
    </Card>
  );
}
