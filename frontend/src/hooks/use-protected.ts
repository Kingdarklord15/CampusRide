"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { roleHome } from "@/constants/routes";

export function useProtected(role?: Role) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!token || !user) router.replace("/login");
    else if (role && user.role !== role) router.replace(roleHome[user.role]);
  }, [token, user, role, router]);

  return { user, token };
}
