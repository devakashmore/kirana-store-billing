import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number().int().positive().default(8000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
    COOKIE_SECURE: z.enum(["true", "false"]).default("false"),
    SESSION_IDLE_TIMEOUT_MINUTES: z.coerce
        .number()
        .int()
        .positive()
        .default(30),
    FRONTEND_URL: z.string().url()

});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error("Invalid environment configuration:");

    console.error(
        parsedEnv.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
        }))
    );
    process.exit(1);
}

export const env = Object.freeze({
    ...parsedEnv.data,
    COOKIE_SECURE: parsedEnv.data.COOKIE_SECURE === "true"
});