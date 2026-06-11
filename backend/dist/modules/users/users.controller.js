import { ok } from "../../utils/response.js";
export class UsersController {
    service;
    constructor(service) {
        this.service = service;
    }
    me = async (req, res) => ok(res, await this.service.getProfile(req.user.id));
    list = async (_req, res) => ok(res, await this.service.listUsers());
    updateMe = async (req, res) => ok(res, await this.service.updateProfile(req.user, req.user.id, req.body));
    getById = async (req, res) => ok(res, await this.service.getProfile(String(req.params.userId)));
    updateById = async (req, res) => ok(res, await this.service.updateProfile(req.user, String(req.params.userId), req.body));
}
