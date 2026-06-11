"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { roleHome } from "@/constants/routes";
import { queryKeys } from "@/constants/query-keys";

export const useCurrentUser = () =>
  useQuery({ queryKey: queryKeys.me, queryFn: authService.me, enabled: !!useAuthStore.getState().accessToken });

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ user, accessToken, refreshToken }) => {
      setAuth(user, accessToken, refreshToken);
      router.push(roleHome[user.role]);
    }
  });
};

export const useRegister = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: authService.register,
    onSuccess: ({ user, accessToken, refreshToken }) => {
      setAuth(user, accessToken, refreshToken);
      router.push(roleHome[user.role]);
    }
  });
};
