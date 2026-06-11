import type { Request, Response } from "express";
import { ok } from "../../utils/response.js";
import type { PassengersService } from "./passengers.service.js";

export class PassengersController {
  constructor(private readonly service: PassengersService) {}

  me = async (req: Request, res: Response) => ok(res, await this.service.getMine(req.user!.id));
  update = async (req: Request, res: Response) => ok(res, await this.service.updateMine(req.user!.id, req.body));
  history = async (req: Request, res: Response) => ok(res, await this.service.history(req.user!.id));
}
