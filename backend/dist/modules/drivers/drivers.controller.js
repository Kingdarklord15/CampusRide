import { created, ok } from "../../utils/response.js";
export class DriversController {
    service;
    constructor(service) {
        this.service = service;
    }
    list = async (_req, res) => ok(res, await this.service.list());
    available = async (_req, res) => ok(res, await this.service.available());
    me = async (req, res) => ok(res, await this.service.getMine(req.user.id));
    create = async (req, res) => created(res, await this.service.create(req.user, req.body));
    update = async (req, res) => ok(res, await this.service.update(req.user, req.body));
    setStatus = async (req, res) => ok(res, await this.service.setStatus(req.user, req.body.status));
    verify = async (req, res) => ok(res, await this.service.verify(String(req.params.driverId)));
    suspend = async (req, res) => ok(res, await this.service.suspend(String(req.params.driverId)));
}
