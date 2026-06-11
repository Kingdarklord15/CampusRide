export const validate = (schema, source = "body") => (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        return next({
            statusCode: 422,
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: result.error.flatten()
        });
    }
    req[source] = result.data;
    return next();
};
