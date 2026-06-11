import { ok } from "../../utils/response.js";
export class AnalyticsController {
    service;
    constructor(service) {
        this.service = service;
    }
    rides = async (_req, res) => ok(res, await this.service.rides());
    drivers = async (_req, res) => ok(res, await this.service.drivers());
    demand = async (_req, res) => ok(res, await this.service.demand());
    overview = async (_req, res) => ok(res, await this.service.overview());
}
