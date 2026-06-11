import { ok } from "../../utils/response.js";
export class PassengersController {
    service;
    constructor(service) {
        this.service = service;
    }
    me = async (req, res) => ok(res, await this.service.getMine(req.user.id));
    update = async (req, res) => ok(res, await this.service.updateMine(req.user.id, req.body));
    history = async (req, res) => ok(res, await this.service.history(req.user.id));
}
