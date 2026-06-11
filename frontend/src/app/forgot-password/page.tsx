"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUiStore } from "@/store/ui.store";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const showToast = useUiStore((state) => state.toast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: "Reset Link Sent",
      description: `If an account exists for ${email}, a password reset link has been sent.`,
      type: "success",
    });
  };

  return (
    <AuthLayout title="Reset password" subtitle="We will send you a password reset link">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@university.edu"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          Send Reset Link
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-zinc-500">
          Remember your password?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
