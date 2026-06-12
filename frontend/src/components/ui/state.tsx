import { AlertCircle, Inbox } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", description = "New activity will appear here." }: { title?: string; description?: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-10 text-center text-white">
      <Inbox className="mb-3 h-8 w-8 text-zinc-500" />
      <p className="font-medium text-sm text-zinc-200">{title}</p>
      <p className="text-xs text-zinc-500 mt-1">{description}</p>
    </div>
  );
}

export function ErrorState({ title = "Something went wrong" }: { title?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-rose-500/20 bg-rose-950/20 p-4 text-sm text-rose-200">
      <AlertCircle className="h-4 w-4 text-rose-400" />
      {title}
    </div>
  );
}
