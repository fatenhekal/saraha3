import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
    if (err instanceof ZodError) {
        err.message = JSON.parse(err.message);
    }

    res.status(err.cause || 500).json({
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV == "production" ? {} : { stack: err.stack })
    });
};
