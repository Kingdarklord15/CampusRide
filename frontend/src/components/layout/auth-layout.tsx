export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <main className="min-h-screen bg-background text-white relative">
      <div className="absolute inset-0 bg-pattern-noise opacity-[0.01] pointer-events-none" />
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[1fr_450px]">
        <section className="hidden border-r border-white/8 bg-white/[0.01] p-12 text-white lg:flex lg:flex-col lg:justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-[120px] pointer-events-none" />
          <div className="text-2xl font-black tracking-tight relative z-10">CampusRide</div>
          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white max-w-md">
              Real-time campus rides, elevated.
            </h1>
            <p className="mt-5 max-w-sm text-zinc-400 text-sm leading-relaxed">
              Passenger requests, driver availability, ride lifecycle tracking, and analytics in one premium operational dashboard.
            </p>
          </div>
          <div className="text-xs text-zinc-500 relative z-10">
            © 2026 CampusRide. Designed for elite university travel.
          </div>
        </section>
        <section className="flex items-center justify-center p-8 bg-black/10 backdrop-blur-sm">
          <div className="w-full max-w-md relative">
            <div className="mb-8">
              <p className="text-3xl font-extrabold tracking-tight text-white">{title}</p>
              <p className="mt-2 text-xs text-zinc-400 font-medium">{subtitle}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
