import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Notification } from "@/types";

export function NotificationCard({ notification }: { notification: Notification }) {
  return (
    <Card>
      <CardContent className="flex gap-3 p-4">
        <Bell className="mt-1 h-4 w-4 text-white" />
        <div>
          <p className="font-bold text-white text-sm">{notification.title}</p>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{notification.message}</p>
          <p className="mt-2 text-[10px] font-mono text-zinc-500">{formatDate(notification.createdAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
