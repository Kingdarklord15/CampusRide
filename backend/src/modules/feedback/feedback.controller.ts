import type { Request, Response } from "express";
import { created, ok } from "../../utils/response.js";
import type { FeedbackService } from "./feedback.service.js";

export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  submit = async (req: Request, res: Response) => created(res, await this.service.submit(req.user!.id, req.body));
  list = async (_req: Request, res: Response) => ok(res, await this.service.list());
  updateStatus = async (req: Request, res: Response) => ok(res, await this.service.updateStatus(String(req.params.feedbackId), req.body.status));
}
