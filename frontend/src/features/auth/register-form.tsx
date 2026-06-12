"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registerSchema } from "@/validations/auth.schema";
import { useRegister } from "@/hooks/use-auth";
import type { z } from "zod";

export function RegisterForm() {
  const mutation = useRegister();
  const form = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema), defaultValues: { name: "", email: "", phone: "", password: "", role: "PASSENGER" } });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <div className="grid gap-2"><Label>Name</Label><Input {...form.register("name")} /></div>
      <div className="grid gap-2"><Label>Email</Label><Input type="email" {...form.register("email")} /></div>
      <div className="grid gap-2"><Label>Phone</Label><Input {...form.register("phone")} /></div>
      <div className="grid gap-2"><Label>Password</Label><Input type="password" {...form.register("password")} /></div>
      <div className="grid gap-2"><Label>Role</Label><Select value={form.watch("role")} onValueChange={(value) => form.setValue("role", value as "PASSENGER" | "DRIVER" | "ADMIN")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PASSENGER">Passenger</SelectItem><SelectItem value="DRIVER">Driver</SelectItem><SelectItem value="ADMIN">Admin</SelectItem></SelectContent></Select></div>
      {mutation.isError ? <p className="text-sm text-rose-400">Registration failed.</p> : null}
      <Button disabled={mutation.isPending}>{mutation.isPending ? "Creating..." : "Create account"}</Button>
      <Link href="/login" className="text-center text-sm text-zinc-400 hover:text-white transition-colors duration-300 hover:underline">Already have an account?</Link>
    </form>
  );
}
