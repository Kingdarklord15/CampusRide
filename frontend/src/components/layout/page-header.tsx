export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">{title}</h1>
        {description ? <p className="mt-1 text-xs text-zinc-400 font-medium">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
