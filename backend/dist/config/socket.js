import { env } from "./env.js";
export const socketConfig = {
    cors: {
        origin: env.CORS_ORIGIN,
        credentials: true
    }
};
