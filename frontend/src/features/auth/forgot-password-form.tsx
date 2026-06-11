"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/validations/auth.schema";
import { useUiStore } from "@/store/ui.store";
import type { z } from "zod";

export function ForgotPasswordForm() {
  const toast = useUiStore((state) => state.toast);
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(() => toast({ title: "Reset link queued", description: "Password reset support can be connected to the backend email provider." }))}>
      <div className="grid gap-2"><Label>Email</Label><Input type="email" {...form.register("email")} />{form.formState.errors.email ? <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p> : null}</div>
      <Button>Send reset link</Button>
    </form>
  );
}
