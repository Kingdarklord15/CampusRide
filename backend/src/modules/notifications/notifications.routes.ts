import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { NotificationsController } from "./notifications.controller.js";
import { NotificationsService } from "./notifications.service.js";
import { createNotificationSchema } from "./notifications.validator.js";

const controller = new NotificationsController(new NotificationsService(prisma));
export const notificationsRoutes = Router();

notificationsRoutes.use(authenticate);
notificationsRoutes.get("/", controller.list);
notificationsRoutes.post("/", authorize("ADMIN"), validate(createNotificationSchema), controller.create);
notificationsRoutes.patch("/:notificationId/read", controller.read);
notificationsRoutes.patch("/read-all", controller.readAll);
