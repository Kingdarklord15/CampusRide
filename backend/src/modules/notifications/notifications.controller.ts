import type { Request, Response } from "express";
import { created, ok } from "../../utils/response.js";
import type { NotificationsService } from "./notifications.service.js";

export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  create = async (req: Request, res: Response) => created(res, await this.service.create(req.body));
  list = async (req: Request, res: Response) => ok(res, await this.service.list(req.user!.id));
  read = async (req: Request, res: Response) => ok(res, await this.service.read(req.user!.id, String(req.params.notificationId)));
  readAll = async (req: Request, res: Response) => ok(res, await this.service.readAll(req.user!.id));
}
