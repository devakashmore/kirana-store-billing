import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateAccessToken(user) {

    return jwt.sign(
        {
            storeId: user.storeId,
            role: user.role
        },
        env.JWT_ACCESS_SECRET,
        {
            subject: user.id,
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
            issuer: "storepilot-api",
            audience: "storepilot-client"
        }
    );

}