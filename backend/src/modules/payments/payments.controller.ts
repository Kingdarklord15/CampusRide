import type { Request, Response } from "express";
import { created, ok } from "../../utils/response.js";
import type { PaymentsService } from "./payments.service.js";

export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  create = async (req: Request, res: Response) => created(res, await this.service.createMockUpi(req.body));
  history = async (req: Request, res: Response) => ok(res, await this.service.history(req.user!));
  updateStatus = async (req: Request, res: Response) => ok(res, await this.service.updateStatus(String(req.params.paymentId), req.body.status));
}
