import type { Request, Response } from "express";
import { created, ok } from "../../utils/response.js";
import type { RatingsService } from "./ratings.service.js";

export class RatingsController {
  constructor(private readonly service: RatingsService) {}

  submit = async (req: Request, res: Response) => created(res, await this.service.submit(req.user!.id, req.body));
  byDriver = async (req: Request, res: Response) => ok(res, await this.service.driverRatings(String(req.params.driverProfileId)));
}
