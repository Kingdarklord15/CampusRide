import { created, ok } from "../../utils/response.js";
export class VehiclesController {
    service;
    constructor(service) {
        this.service = service;
    }
    getMine = async (req, res) => ok(res, await this.service.getMine(req.user.id));
    add = async (req, res) => created(res, await this.service.add(req.user.id, req.body));
    update = async (req, res) => ok(res, await this.service.update(req.user.id, req.body));
}
