import type { Request, Response } from "express";
import { created, noContent, ok } from "../../utils/response.js";
import type { AuthService } from "./auth.service.js";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (req: Request, res: Response) => created(res, await this.service.register(req.body), "Registered");
  login = async (req: Request, res: Response) => ok(res, await this.service.login(req.body), "Logged in");
  refresh = async (req: Request, res: Response) => ok(res, await this.service.refresh(req.body.refreshToken), "Token refreshed");
  logout = async (req: Request, res: Response) => {
    await this.service.logout(req.user!.id);
    return noContent(res);
  };
  me = async (req: Request, res: Response) => ok(res, await this.service.me(req.user!.id));
}
