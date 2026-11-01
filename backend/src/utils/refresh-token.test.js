
import { describe, it, expect } from "vitest";
import {
    generateRefreshToken,
    hashRefreshToken
} from "./refresh-token.js";

describe("Refresh token utilities", () => {
    it("generates a secure random refresh token", () => {
        const token = generateRefreshToken();

        expect(token).toHaveLength(128);
        expect(typeof token).toBe("string");
    });

    it("generates different tokens", () => {
        const token1 = generateRefreshToken();
        const token2 = generateRefreshToken();

        expect(token1).not.toBe(token2);
    });

    it("generates a consistent SHA-256 hash", () => {
        const token = "sample-refresh-token";

        expect(hashRefreshToken(token))
            .toBe(hashRefreshToken(token));
    });

    it("does not return the original token as its hash", () => {
        const token = generateRefreshToken();

        expect(hashRefreshToken(token)).not.toBe(token);
        expect(hashRefreshToken(token)).toHaveLength(64);
    });
});
