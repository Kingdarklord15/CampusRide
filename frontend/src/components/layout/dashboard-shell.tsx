"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import type { Role } from "@/types";
import { navItems } from "@/constants/routes";
import { useProtected } from "@/hooks/use-protected";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user } = useProtected(role);
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const items = navItems[role];
  return (
    <div className="min-h-screen bg-background relative text-white">
      {/* Subtle global paper noise overlay */}
      <div className="absolute inset-0 bg-pattern-noise opacity-[0.01] pointer-events-none" />
      
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/8 bg-white/[0.01] backdrop-blur-xl p-6 lg:block z-20">
        <Link href="/" className="font-display text-2xl font-black tracking-tight text-white hover:opacity-85 transition-all duration-300">
          CampusRide
        </Link>
        <nav className="mt-8 grid gap-2">
          {items.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-4 py-2.5 text-xs font-mono font-semibold tracking-wider uppercase rounded-md transition-all duration-300",
                pathname === href
                  ? "bg-white text-black shadow-md shadow-white/5"
                  : "text-zinc-400 border border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-4 z-30 mx-4 lg:mx-8 my-4 flex h-16 items-center justify-between rounded-md border border-white/8 bg-white/[0.02] backdrop-blur-md px-6 shadow-md">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-zinc-500">Welcome back</p>
              <p className="font-display font-bold text-zinc-100 text-sm leading-none mt-1">{user?.name ?? role.toLowerCase()}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="h-9 font-mono text-xs"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </header>
        <main className="p-6 lg:p-10 relative z-10">{children}</main>
      </div>
    </div>
  );
}
