import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "./password.js";

describe("Password utilities", () => {
    it("should hash a password", async () => {
        const password = "StorePilot@2026";

        const hashedPassword = await hashPassword(password);

        expect(hashedPassword).not.toBe(password);
        expect(hashedPassword).toMatch(/^\$2[aby]\$/);
    });

    it("should verify the correct password", async () => {
        const password = "StorePilot@2026";

        const hashedPassword = await hashPassword(password);

        const result = await comparePassword(password, hashedPassword);

        expect(result).toBe(true);
    });

    it("should reject an incorrect password", async () => {
        const hashedPassword = await hashPassword("StorePilot@2026");

        const result = await comparePassword(
            "WrongPassword@123",
            hashedPassword
        );

        expect(result).toBe(false);
    });

    it("should reject passwords exceeding 72 bytes", async () => {
        const password = "a".repeat(73);

        await expect(hashPassword(password)).rejects.toThrow(
            "Password cannot exceed 72 bytes"
        );
    });
});