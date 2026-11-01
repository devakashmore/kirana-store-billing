import jwt from "jsonwebtoken"
import { env } from "../config/env.js";


// Reads the access token from the Authorization header.
// Verifies its signature, expiry, issuer and audience.
// Attaches the authenticated user's ID, store ID and role to req.user.
// Rejects missing or invalid tokens with 401.444

export function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required."
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required."
            });
        }
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
            issuer: "storepilot-api",
            audience: "storepilot-client",
            algorithms: ["HS256"]
        });
        if (typeof decoded === "string" ||
            !decoded.sub ||
            !decoded.storeId ||
            !["OWNER", "CASHIER"].includes(decoded.role)
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token."
            });
        }

        req.user = {
            id: decoded.sub,
            storeId: decoded.storeId,
            role: decoded.role
        };
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token."
        });
    }
}
