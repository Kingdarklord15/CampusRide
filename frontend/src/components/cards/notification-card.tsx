import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Notification } from "@/types";

export function NotificationCard({ notification }: { notification: Notification }) {
  return <Card><CardContent className="flex gap-3 p-4"><Bell className="mt-1 h-4 w-4 text-indigo-600" /><div><p className="font-medium">{notification.title}</p><p className="text-sm text-zinc-600">{notification.message}</p><p className="mt-1 text-xs text-zinc-400">{formatDate(notification.createdAt)}</p></div></CardContent></Card>;
}
