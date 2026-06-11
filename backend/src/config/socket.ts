import type { ServerOptions } from "socket.io";
import { env } from "./env.js";

export const socketConfig: Partial<ServerOptions> = {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://172.26.112.1:3000"
    ],
    credentials: true
  }
};