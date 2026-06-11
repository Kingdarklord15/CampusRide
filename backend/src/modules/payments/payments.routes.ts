import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { PaymentsController } from "./payments.controller.js";
import { PaymentsService } from "./payments.service.js";
import { createPaymentSchema, paymentStatusSchema } from "./payments.validator.js";

const controller = new PaymentsController(new PaymentsService(prisma));
export const paymentsRoutes = Router();

paymentsRoutes.use(authenticate);
paymentsRoutes.post("/", validate(createPaymentSchema), controller.create);
paymentsRoutes.get("/", authorize("ADMIN"), controller.history);
paymentsRoutes.patch("/:paymentId/status", authorize("ADMIN"), validate(paymentStatusSchema), controller.updateStatus);
