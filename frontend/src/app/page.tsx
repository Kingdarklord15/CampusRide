import Link from "next/link";
import { ArrowRight, Shield, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">CampusRide</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 px-6 py-20 lg:px-12 lg:py-32 max-w-6xl mx-auto flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-6 animate-pulse">
          ⚡ Real-time campus transit
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-zinc-900 leading-tight">
          Your campus. <br />
          <span className="text-indigo-600 bg-clip-text">Your ride, on demand.</span>
        </h1>
        <p className="mt-6 text-xl text-zinc-500 max-w-2xl leading-relaxed">
          Request rides, track drivers in real-time, and get around university campus effortlessly and safely.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-8" asChild>
            <Link href="/register">
              Sign Up as Passenger <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 px-8" asChild>
            <Link href="/login?role=DRIVER">
              Become a Driver
            </Link>
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          <div className="p-8 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Live Map Tracking</h3>
            <p className="mt-2 text-sm text-zinc-500">
              See your ride move in real-time with our integrated OpenStreetMap and Leaflet tracking.
            </p>
          </div>
          <div className="p-8 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Instant Dispatch</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Request a ride instantly and online drivers in your vicinity are notified in seconds.
            </p>
          </div>
          <div className="p-8 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Secure Campus Transit</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Exclusively for university students and verified drivers. Safe and trusted travel.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-10 text-center text-sm text-zinc-500 px-6 mt-auto">
        <p>© 2026 CampusRide. Designed for elite university travel.</p>
      </footer>
    </div>
  );
}
