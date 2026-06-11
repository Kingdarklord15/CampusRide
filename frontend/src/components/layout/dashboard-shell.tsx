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
    <div className="min-h-screen bg-white relative">
      {/* Subtle global paper noise overlay */}
      <div className="absolute inset-0 bg-pattern-noise opacity-[0.02] pointer-events-none" />
      
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black bg-white p-6 lg:block z-20">
        <Link href="/" className="font-display text-2xl font-black tracking-tight text-black hover:italic transition-all duration-100">
          CampusRide
        </Link>
        <nav className="mt-8 grid gap-2">
          {items.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-2 text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-100",
                pathname === href
                  ? "bg-black text-white border-2 border-black"
                  : "text-zinc-600 border-2 border-transparent hover:border-black hover:text-black"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black bg-white px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Welcome back</p>
              <p className="font-display font-bold text-zinc-900">{user?.name ?? role.toLowerCase()}</p>
            </div>
          </div>
          <Button
            variant="outline"
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
