import { created, ok } from "../../utils/response.js";
export class FeedbackController {
    service;
    constructor(service) {
        this.service = service;
    }
    submit = async (req, res) => created(res, await this.service.submit(req.user.id, req.body));
    list = async (_req, res) => ok(res, await this.service.list());
    updateStatus = async (req, res) => ok(res, await this.service.updateStatus(String(req.params.feedbackId), req.body.status));
}
