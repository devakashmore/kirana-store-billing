
import { prisma } from "../../config/database.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { randomUUID } from "node:crypto";
import { generateRefreshToken, hashRefreshToken } from "../../utils/refresh-token.js";

export async function registerOwner(data) {
    const {
        storeName,
        name,
        email,
        mobile,
        password
    } = data;

    // frist hased the password
    const passwordHash = await hashPassword(password);

    try {
        const result = await prisma.$transaction(
            async (tx) => {
                //  only allow   registration of the first store
                const storeCount = await tx.store.count();

                if (storeCount > 0) {
                    const error = new Error(
                        "Store registration is currently closed."
                    );
                    error.statusCode = 403;
                    throw error;
                }

                // Create store and owner together

                const store = await tx.store.create({
                    data: {
                        name: storeName,

                        users: {
                            create: {
                                name,
                                email: email || null,
                                mobile: mobile || null,
                                passwordHash,
                                role: "OWNER"
                            }
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        users: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                mobile: true,
                                role: true,
                                isActive: true,
                                createdAt: true
                            }
                        }
                    }
                });
                return store;
            },
            {
                isolationLevel: "Serializable"
            }
        );
        return result;

    } catch (error) {
        if (error.code === "P2002") {
            const conflictError = new Error(
                "Email or mobile number is already registered."
            );

            conflictError.statusCode = 409;
            throw conflictError;
        }

        throw error;

    }

}

// Find the owner using their email or mobile number.
// Reject inactive or nonexistent accounts.
// Verify the password using bcrypt.
// Return safe user details without exposing the password hash.

export async function loginUser(data) {
    const { identifier, password } = data;
    const normalizedIdentifier = identifier.includes("@") ?
        identifier.toLowerCase() :
        identifier;

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: normalizedIdentifier },
                { mobile: normalizedIdentifier }
            ]
        }
    });

    if (!user || !user.isActive) {
        const error = new Error("Invalid email/mobile number or password.");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
        const error = new Error("Invalid email/mobile number or password.");
        error.statusCode = 401;
        throw error;
    }

    return {
        id: user.id,
        storeId: user.storeId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isActive: user.isActive
    };
}

export async function createRefreshSession(userId, requestInfo = {}) {
    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);
    // Keeping it  aligned with REFRESH_TOKEN_EXPIRES_IN=7d.

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshSession.create({
        data: {
            userId,
            tokenHash,
            familyId: randomUUID(),
            expiresAt,
            userAgent: requestInfo.userAgent?.slice(0, 500) || null,
            ipAddress: requestInfo.ipAddress || null
        }
    });
    // Return the raw token only to the controller for the HTTP-only cookie.
    return refreshToken;
}

export async function refreshUserSession(rawRefreshToken, requestInfo = {}) {

    if (!rawRefreshToken || typeof rawRefreshToken !== "string") {
        const error = new Error("Invalid refresh session.");
        error.statusCode = 401;
        throw error;
    }

    const tokenHash = hashRefreshToken(rawRefreshToken);
    const session = await prisma.refreshSession.findUnique({
        where: { tokenHash },
        include: {
            user: {
                include: {
                    store: true
                }
            }
        }
    });
    if (!session) {
        const error = new Error("Invalid refresh session.");
        error.statusCode = 401;
        throw error;
    }
    // Reuse of a previously rotated token: revoke its active family.
    if (session.revokedAt) {
        await prisma.refreshSession.updateMany({
            where: {
                familyId: session.familyId,
                revokedAt: null
            },
            data: {
                revokedAt: new Date()
            }
        });
        const error = new Error("Refresh token reuse detected. Please log in again.");
        error.statusCode = 401;
        throw error;

    }
    const now = new Date();
    const user = session.user;
    const idleTimeoutMinutes = user.store.sessionIdleTimeoutMinutes;
    const idleDeadline = new Date(
        session.lastActivityAt.getTime() + idleTimeoutMinutes * 60 * 1000
    );

    if (
        session.expiresAt <= now ||
        idleDeadline <= now ||
        !user.isActive
    ) {
        const error = new Error("Refresh session expired. Please log in again.");
        error.statusCode = 401;
        throw error;
    }

    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashRefreshToken(newRefreshToken);
    const newSessionId = randomUUID();

    try {
        await prisma.$transaction(async (tx) => {
            const updated = await tx.refreshSession.updateMany({
                where: {
                    id: session.id,
                    revokedAt: null,
                    expiresAt: { gt: now }
                },
                data: {
                    revokedAt: now,
                    replacedBySessionId: newSessionId
                }
            });

            if (updated.count !== 1) {
                const error = new Error("Refresh token reuse detected.");
                error.code = "SESSION_REUSED";
                throw error;
            }

            await tx.refreshSession.create({
                data: {
                    id: newSessionId,
                    userId: user.id,
                    tokenHash: newTokenHash,
                    familyId: session.familyId,
                    expiresAt: session.expiresAt,
                    lastActivityAt: now,
                    userAgent: requestInfo.userAgent?.slice(0, 500) || null,
                    ipAddress: requestInfo.ipAddress || null
                }
            });
        }, {
            isolationLevel: "Serializable"
        });
    } catch (error) {
        if (error.code === "SESSION_REUSED" || error.code === "P2034") {
            await prisma.refreshSession.updateMany({
                where: {
                    familyId: session.familyId,
                    revokedAt: null
                },
                data: {
                    revokedAt: new Date()
                }
            });

            const reuseError = new Error(
                "Refresh token reuse detected. Please log in again."
            );
            reuseError.statusCode = 401;
            throw reuseError;
        }

        throw error;
    }

    return {
        refreshToken: newRefreshToken,
        user: {
            id: user.id,
            storeId: user.storeId,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            isActive: user.isActive
        }
    };
}

export async function logoutUser(rawRefreshToken) {
    if (!rawRefreshToken || typeof rawRefreshToken !== "string") {
        return;
    }

    const tokenHash = hashRefreshToken(rawRefreshToken);
    await prisma.refreshSession.updateMany({
        where: {
            tokenHash,
            revokedAt: null
        },
        data: {
            revokedAt: new Date()
        }
    })
}