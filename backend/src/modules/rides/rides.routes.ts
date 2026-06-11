import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { RidesController } from "./rides.controller.js";
import { RidesService } from "./rides.service.js";
import { assignDriverSchema, cancelRideSchema, createRideSchema } from "./rides.validator.js";

const controller = new RidesController(new RidesService(prisma));
export const ridesRoutes = Router();

ridesRoutes.use(authenticate);
ridesRoutes.get("/", controller.list);
ridesRoutes.post("/", authorize("PASSENGER"), validate(createRideSchema), controller.create);
ridesRoutes.get("/:rideId", controller.get);
ridesRoutes.get("/:rideId/status-history", controller.statusHistory);
ridesRoutes.patch("/:rideId/assign", authorize("ADMIN"), validate(assignDriverSchema), controller.assign);
ridesRoutes.patch("/:rideId/accept", authorize("DRIVER"), controller.accept);
ridesRoutes.patch("/:rideId/reject", authorize("DRIVER"), controller.reject);
ridesRoutes.patch("/:rideId/cancel", validate(cancelRideSchema), controller.cancel);
ridesRoutes.patch("/:rideId/arriving", authorize("DRIVER"), controller.arriving);
ridesRoutes.patch("/:rideId/start", authorize("DRIVER"), controller.start);
ridesRoutes.patch("/:rideId/complete", authorize("DRIVER"), controller.complete);
