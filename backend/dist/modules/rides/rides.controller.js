import { created, ok } from "../../utils/response.js";
export class RidesController {
    service;
    constructor(service) {
        this.service = service;
    }
    list = async (req, res) => ok(res, await this.service.list(req.user));
    get = async (req, res) => ok(res, await this.service.getById(String(req.params.rideId)));
    create = async (req, res) => created(res, await this.service.create(req.user.id, req.body));
    assign = async (req, res) => ok(res, await this.service.assignDriver(req.user, String(req.params.rideId), req.body.driverProfileId));
    accept = async (req, res) => ok(res, await this.service.accept(req.user, String(req.params.rideId)));
    reject = async (req, res) => ok(res, await this.service.reject(req.user, String(req.params.rideId)));
    cancel = async (req, res) => ok(res, await this.service.cancel(req.user, String(req.params.rideId), req.body.reason));
    arriving = async (req, res) => ok(res, await this.service.arriving(req.user, String(req.params.rideId)));
    start = async (req, res) => ok(res, await this.service.start(req.user, String(req.params.rideId)));
    complete = async (req, res) => ok(res, await this.service.complete(req.user, String(req.params.rideId)));
    statusHistory = async (req, res) => ok(res, await this.service.statusHistory(String(req.params.rideId)));
}
