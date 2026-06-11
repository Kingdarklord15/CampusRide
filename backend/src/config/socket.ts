import type { ServerOptions } from "socket.io";
import { env } from "./env.js";

export const socketConfig: Partial<ServerOptions> = {
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true
  }
};
