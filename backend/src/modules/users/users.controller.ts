import type { Request, Response } from "express";
import { ok } from "../../utils/response.js";
import type { UsersService } from "./users.service.js";

export class UsersController {
  constructor(private readonly service: UsersService) {}

  me = async (req: Request, res: Response) => ok(res, await this.service.getProfile(req.user!.id));
  list = async (_req: Request, res: Response) => ok(res, await this.service.listUsers());
  updateMe = async (req: Request, res: Response) => ok(res, await this.service.updateProfile(req.user!, req.user!.id, req.body));
  getById = async (req: Request, res: Response) => ok(res, await this.service.getProfile(String(req.params.userId)));
  updateById = async (req: Request, res: Response) => ok(res, await this.service.updateProfile(req.user!, String(req.params.userId), req.body));
}
