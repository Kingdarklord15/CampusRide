import { created, noContent, ok } from "../../utils/response.js";
export class AuthController {
    service;
    constructor(service) {
        this.service = service;
    }
    register = async (req, res) => created(res, await this.service.register(req.body), "Registered");
    login = async (req, res) => ok(res, await this.service.login(req.body), "Logged in");
    refresh = async (req, res) => ok(res, await this.service.refresh(req.body.refreshToken), "Token refreshed");
    logout = async (req, res) => {
        await this.service.logout(req.user.id);
        return noContent(res);
    };
    me = async (req, res) => ok(res, await this.service.me(req.user.id));
}
