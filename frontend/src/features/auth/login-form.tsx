"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/validations/auth.schema";
import { useLogin } from "@/hooks/use-auth";
import type { z } from "zod";

export function LoginForm() {
  const mutation = useLogin();
  const form = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <div className="grid gap-2"><Label>Email</Label><Input type="email" {...form.register("email")} />{form.formState.errors.email ? <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p> : null}</div>
      <div className="grid gap-2"><Label>Password</Label><Input type="password" {...form.register("password")} /></div>
      {mutation.isError ? <p className="text-sm text-rose-400">Invalid credentials.</p> : null}
      <Button disabled={mutation.isPending}>{mutation.isPending ? "Signing in..." : "Sign in"}</Button>
      <div className="flex justify-between text-sm"><Link href="/forgot-password" className="text-zinc-400 hover:text-white transition-colors duration-300 hover:underline">Forgot password?</Link><Link href="/register" className="text-zinc-400 hover:text-white transition-colors duration-300 hover:underline">Create account</Link></div>
    </form>
  );
}
