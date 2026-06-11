import http from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { logger } from "./utils/logger.js";
import { createSocketServer } from "./sockets/index.js";
const server = http.createServer(app);
createSocketServer(server);
server.listen(env.PORT, () => {
    logger.info(`CampusRide API listening on port ${env.PORT}`);
});
const shutdown = async () => {
    logger.info("Shutting down CampusRide API");
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
