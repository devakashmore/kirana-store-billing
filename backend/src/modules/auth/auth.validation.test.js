import { describe, it, expect } from "vitest";
import { ownerRegistrationSchema } from "./auth.validation.js";

describe("Owner Registration Validation", () => {

    const validOwner = {
        storeName: "StorePilot Mart",
        name: "Akash More",
        email: "akash@example.com",
        mobile: "9876543210",
        password: "StorePilot@2026"
    };

    it("should accept valid registration data", () => {
        const result = ownerRegistrationSchema.safeParse(validOwner);

        expect(result.success).toBe(true);
    });

    it("should normalize email to lowercase", () => {
        const result = ownerRegistrationSchema.safeParse({
            ...validOwner,
            email: "AKASH@EXAMPLE.COM"
        });

        expect(result.data.email).toBe("akash@example.com");
    });

    it("should reject invalid email", () => {
        const result = ownerRegistrationSchema.safeParse({
            ...validOwner,
            email: "invalid-email"
        });

        expect(result.success).toBe(false);
    });

    it("should reject missing email and mobile", () => {
        const result = ownerRegistrationSchema.safeParse({
            ...validOwner,
            email: "",
            mobile: ""
        });

        expect(result.success).toBe(false);
    });

    it("should reject short passwords", () => {
        const result = ownerRegistrationSchema.safeParse({
            ...validOwner,
            password: "12345"
        });

        expect(result.success).toBe(false);
    });
});


import { loginSchema } from "./auth.validation.js";

describe("loginSchema", () => {
  it("accepts valid login credentials", () => {
    const result = loginSchema.safeParse({
      identifier: "owner@example.com",
      password: "StrongPassword123!"
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty identifier", () => {
    const result = loginSchema.safeParse({
      identifier: "",
      password: "StrongPassword123!"
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      identifier: "owner@example.com",
      password: ""
    });

    expect(result.success).toBe(false);
  });
});