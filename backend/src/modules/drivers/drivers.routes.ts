import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { DriversController } from "./drivers.controller.js";
import { DriversService } from "./drivers.service.js";
import { createDriverProfileSchema, driverStatusSchema, updateDriverProfileSchema } from "./drivers.validator.js";

const controller = new DriversController(new DriversService(prisma));
export const driversRoutes = Router();

driversRoutes.use(authenticate);
driversRoutes.get("/", authorize("ADMIN"), controller.list);
driversRoutes.get("/available", controller.available);
driversRoutes.get("/me", authorize("DRIVER"), controller.me);
driversRoutes.post("/me", authorize("DRIVER"), validate(createDriverProfileSchema), controller.create);
driversRoutes.patch("/me", authorize("DRIVER"), validate(updateDriverProfileSchema), controller.update);
driversRoutes.patch("/me/status", authorize("DRIVER"), validate(driverStatusSchema), controller.setStatus);
driversRoutes.patch("/:driverId/verify", authorize("ADMIN"), controller.verify);
driversRoutes.patch("/:driverId/suspend", authorize("ADMIN"), controller.suspend);
