import { created, ok } from "../../utils/response.js";
export class NotificationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create = async (req, res) => created(res, await this.service.create(req.body));
    list = async (req, res) => ok(res, await this.service.list(req.user.id));
    read = async (req, res) => ok(res, await this.service.read(req.user.id, String(req.params.notificationId)));
    readAll = async (req, res) => ok(res, await this.service.readAll(req.user.id));
}
