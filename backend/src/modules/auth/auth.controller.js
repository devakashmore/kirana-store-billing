
import {
    registerOwner,
    loginUser,
    createRefreshSession,
    refreshUserSession,
    logoutUser
} from "./auth.service.js";
import { generateAccessToken } from "../../utils/token.js";
import { env } from "../../config/env.js";
import { prisma } from "../../config/database.js"


export async function registerOwnerController(req, res, next) {
    try {
        const store = await registerOwner(req.body);

        return res.status(201).json({
            success: true,
            message: "Store and owner account created successfully",
            data: {
                store: {
                    id: store.id,
                    name: store.name,
                },
                owner: store.users[0]
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function loginController(req, res, next) {
    try {
        const user = await loginUser(req.body);

        const accessToken = generateAccessToken(user);
        const refreshToken = await createRefreshSession(user.id, {
            userAgent: req.get("user-agent"),
            ipAddress: req.ip
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.COOKIE_SECURE,
            sameSite: "lax",
            path: "/api/v1/auth",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user,
                accessToken
            }
        });
    } catch (error) {
        next(error);
    }
}


export async function refreshController(req, res, next) {
    try {
        const oldRefreshToken = req.cookies?.refreshToken;

        const result = await refreshUserSession(oldRefreshToken, {
            userAgent: req.get("user-agent"),
            ipAddress: req.ip
        });

        const accessToken = generateAccessToken(result.user);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: env.COOKIE_SECURE,
            sameSite: "lax",
            path: "/api/v1/auth",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Session refreshed successfully",
            data: {
                user: result.user,
                accessToken
            }
        });
    } catch (error) {
        if (error.statusCode === 401) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: env.COOKIE_SECURE,
                sameSite: "lax",
                path: "/api/v1/auth"
            });
        }

        next(error);
    }
}

export async function logoutController(req, res, next) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        await logoutUser(refreshToken);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.COOKIE_SECURE,
            sameSite: "lax",
            path: "/api/v1/auth"
        });
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
}

export async function getMeController(req, res, next) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: req.user.id,
                storeId: req.user.storeId,
                isActive: true
            },
            select: {
                id: true,
                storeId: true,
                name: true,
                email: true,
                mobile: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account is not available."
            });
        }
        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: { user }
        });
    } catch (error) {
        next(error);
    }
}