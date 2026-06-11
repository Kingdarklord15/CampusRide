import type { Request, Response } from "express";
import { ok } from "../../utils/response.js";
import type { AnalyticsService } from "./analytics.service.js";

export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  rides = async (_req: Request, res: Response) => ok(res, await this.service.rides());
  drivers = async (_req: Request, res: Response) => ok(res, await this.service.drivers());
  demand = async (_req: Request, res: Response) => ok(res, await this.service.demand());
  overview = async (_req: Request, res: Response) => ok(res, await this.service.overview());
}
