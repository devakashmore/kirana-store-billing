
import { logger } from "../config/logger.js";

export function errorMiddleware(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || err.status || 500;

    logger.error(
        {
            err,
            method: req.method,
            url: req.originalUrl
        },
        "Request failed"
    );

    res.status(statusCode).json({
        success: false,
        message:
            statusCode >= 500
                ? "Internal server error"
                : err.message || "Request failed"
    });
}
