import { AlertCircle, Inbox } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", description = "New activity will appear here." }: { title?: string; description?: string }) {
  return <div className="grid place-items-center rounded-lg border border-dashed bg-white p-10 text-center"><Inbox className="mb-3 h-8 w-8 text-zinc-400" /><p className="font-medium">{title}</p><p className="text-sm text-zinc-500">{description}</p></div>;
}

export function ErrorState({ title = "Something went wrong" }: { title?: string }) {
  return <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle className="h-4 w-4" />{title}</div>;
}
