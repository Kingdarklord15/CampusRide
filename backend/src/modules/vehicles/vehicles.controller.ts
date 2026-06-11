import type { Request, Response } from "express";
import { created, ok } from "../../utils/response.js";
import type { VehiclesService } from "./vehicles.service.js";

export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  getMine = async (req: Request, res: Response) => ok(res, await this.service.getMine(req.user!.id));
  add = async (req: Request, res: Response) => created(res, await this.service.add(req.user!.id, req.body));
  update = async (req: Request, res: Response) => ok(res, await this.service.update(req.user!.id, req.body));
}
