import { forbidden } from "../utils/errors.js";
export const authorize = (...roles) => (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role))
        return next(forbidden());
    return next();
};
