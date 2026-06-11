"use client";

import { useState } from "react";
import Link from "next/link";
import { useRegister } from "@/hooks/use-auth";
import { useUiStore } from "@/store/ui.store";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SelectedRole = "PASSENGER" | "DRIVER";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<SelectedRole>("PASSENGER");
  
  const register = useRegister();
  const showToast = useUiStore((state) => state.toast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast({ title: "Validation Error", description: "Name, email, and password are required", type: "error" });
      return;
    }

    try {
      await register.mutateAsync({ name, email, phone: phone || undefined, password, role });
      showToast({ title: "Account Created", description: `Registered successfully as ${role.toLowerCase()}`, type: "success" });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to register";
      showToast({ title: "Registration Failed", description: msg, type: "error" });
    }
  };

  return (
    <AuthLayout title="Get started" subtitle="Create your university CampusRide account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector Tabs */}
        <div className="space-y-1">
          <Label>I want to register as a</Label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-lg">
            <button
              type="button"
              onClick={() => setRole("PASSENGER")}
              className={`py-2 text-sm font-semibold rounded-md transition-all ${
                role === "PASSENGER"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Passenger
            </button>
            <button
              type="button"
              onClick={() => setRole("DRIVER")}
              className={`py-2 text-sm font-semibold rounded-md transition-all ${
                role === "DRIVER"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Driver
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={register.isPending}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@university.edu"
            required
            disabled={register.isPending}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            disabled={register.isPending}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={register.isPending}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={register.isPending}
        >
          {register.isPending ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
