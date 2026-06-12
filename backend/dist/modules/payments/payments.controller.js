import { created, ok } from "../../utils/response.js";
export class PaymentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create = async (req, res) => created(res, await this.service.createMockUpi(req.body));
    history = async (req, res) => ok(res, await this.service.history(req.user));
    updateStatus = async (req, res) => ok(res, await this.service.updateStatus(String(req.params.paymentId), req.body.status));
}
