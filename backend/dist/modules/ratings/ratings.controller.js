import { created, ok } from "../../utils/response.js";
export class RatingsController {
    service;
    constructor(service) {
        this.service = service;
    }
    submit = async (req, res) => created(res, await this.service.submit(req.user.id, req.body));
    byDriver = async (req, res) => ok(res, await this.service.driverRatings(String(req.params.driverProfileId)));
}
