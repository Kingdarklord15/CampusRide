import type { Role } from "@prisma/client";

export type RegisterInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
