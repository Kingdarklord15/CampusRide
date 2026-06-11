import type { Request, Response } from "express";
import { created, ok } from "../../utils/response.js";
import type { DriversService } from "./drivers.service.js";

export class DriversController {
  constructor(private readonly service: DriversService) {}

  list = async (_req: Request, res: Response) => ok(res, await this.service.list());
  available = async (_req: Request, res: Response) => ok(res, await this.service.available());
  me = async (req: Request, res: Response) => ok(res, await this.service.getMine(req.user!.id));
  create = async (req: Request, res: Response) => created(res, await this.service.create(req.user!, req.body));
  update = async (req: Request, res: Response) => ok(res, await this.service.update(req.user!, req.body));
  setStatus = async (req: Request, res: Response) => ok(res, await this.service.setStatus(req.user!, req.body.status));
  verify = async (req: Request, res: Response) => ok(res, await this.service.verify(String(req.params.driverId)));
  suspend = async (req: Request, res: Response) => ok(res, await this.service.suspend(String(req.params.driverId)));
}
