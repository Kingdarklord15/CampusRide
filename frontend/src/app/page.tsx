import Link from "next/link";
import { ArrowRight, Shield, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent relative text-white">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-pattern-grid opacity-[0.4] pointer-events-none" />
      <div className="absolute inset-0 bg-pattern-noise opacity-[0.01] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-pattern-radial-cta opacity-[0.5] pointer-events-none" />
      
      {/* Header */}
      <header className="mx-6 my-4 h-16 flex items-center justify-between border border-white/8 bg-white/[0.02] backdrop-blur-md rounded-md px-6 sticky top-4 z-50 shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-black font-extrabold text-lg">
            C
          </div>
          <span className="text-lg font-black tracking-tight text-white">CampusRide</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-9 px-4 text-xs font-mono" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="default" className="h-9 px-4 text-xs font-mono" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 px-6 py-20 lg:px-12 lg:py-28 max-w-6xl mx-auto flex flex-col items-center text-center justify-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-zinc-300 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase mb-6 animate-pulse">
          ⚡ Real-time campus transit
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight text-white">
          Your campus. <br />
          <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">Your ride, on demand.</span>
        </h1>
        <p className="mt-6 text-sm text-zinc-400 max-w-xl leading-relaxed font-medium">
          Request rides, track drivers in real-time, and get around university campus effortlessly and safely.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button size="lg" variant="default" className="gap-2 px-8" asChild>
            <Link href="/register">
              Passenger Sign Up <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" className="px-8" asChild>
            <Link href="/login?role=DRIVER">
              Become a Driver
            </Link>
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full">
          <div className="p-8 rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-md shadow-glass flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            <div className="h-12 w-12 rounded-lg bg-white/5 text-white flex items-center justify-center mb-5 border border-white/5">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-md font-extrabold tracking-tight text-white">Live Map Tracking</h3>
            <p className="mt-2 text-xs text-zinc-400 font-medium leading-relaxed">
              See your ride move in real-time with our integrated OpenStreetMap and Leaflet tracking.
            </p>
          </div>
          <div className="p-8 rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-md shadow-glass flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            <div className="h-12 w-12 rounded-lg bg-white/5 text-white flex items-center justify-center mb-5 border border-white/5">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-md font-extrabold tracking-tight text-white">Instant Dispatch</h3>
            <p className="mt-2 text-xs text-zinc-400 font-medium leading-relaxed">
              Request a ride instantly and online drivers in your vicinity are notified in seconds.
            </p>
          </div>
          <div className="p-8 rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-md shadow-glass flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            <div className="h-12 w-12 rounded-lg bg-white/5 text-white flex items-center justify-center mb-5 border border-white/5">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-md font-extrabold tracking-tight text-white">Secure Campus Transit</h3>
            <p className="mt-2 text-xs text-zinc-400 font-medium leading-relaxed">
              Exclusively for university students and verified drivers. Safe and trusted travel.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-zinc-500 px-6 mt-auto">
        <p>© 2026 CampusRide. Designed for elite university travel.</p>
      </footer>
    </div>
  );
}
