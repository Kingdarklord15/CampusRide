import type { Request, Response } from "express";
import { created, ok } from "../../utils/response.js";
import type { RidesService } from "./rides.service.js";

export class RidesController {
  constructor(private readonly service: RidesService) {}

  list = async (req: Request, res: Response) => ok(res, await this.service.list(req.user!));
  get = async (req: Request, res: Response) => ok(res, await this.service.getById(String(req.params.rideId)));
  create = async (req: Request, res: Response) => created(res, await this.service.create(req.user!.id, req.body));
  assign = async (req: Request, res: Response) => ok(res, await this.service.assignDriver(req.user!, String(req.params.rideId), req.body.driverProfileId));
  accept = async (req: Request, res: Response) => ok(res, await this.service.accept(req.user!, String(req.params.rideId)));
  reject = async (req: Request, res: Response) => ok(res, await this.service.reject(req.user!, String(req.params.rideId)));
  cancel = async (req: Request, res: Response) => ok(res, await this.service.cancel(req.user!, String(req.params.rideId), req.body.reason));
  arriving = async (req: Request, res: Response) => ok(res, await this.service.arriving(req.user!, String(req.params.rideId)));
  start = async (req: Request, res: Response) => ok(res, await this.service.start(req.user!, String(req.params.rideId)));
  complete = async (req: Request, res: Response) => ok(res, await this.service.complete(req.user!, String(req.params.rideId)));
  statusHistory = async (req: Request, res: Response) => ok(res, await this.service.statusHistory(String(req.params.rideId)));
}
