import { email, superRefine, z } from "zod";

const mobileRegex = /^(?:\+?[1-9]\d{7,14}|[6-9]\d{9})$/;

export const ownerRegistrationSchema = z.object({
    storeName: z.string()
        .trim()
        .min(2, "Store name must contain at least 2 characters")
        .max(150, "Store name cannot exceed 150 characters"),
    name: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(150, "Name cannot exceed 150 characters"),
    email: z
        .string()
        .trim()
        .email("Enter a valid email address")
        .max(254)
        .transform(value => value.toLowerCase())
        .optional()
        .or(z.literal("")),
    mobile: z
        .string()
        .trim()
        .regex(mobileRegex, "Enter a valid mobile number")
        .optional()
        .or(z.literal("")),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .refine(
            value => Buffer.byteLength(value, "utf8") <= 72,
            "Password cannot exceed 72 bytes"
        )
}).superRefine((data, ctx) => {
    if (!data.email && !data.mobile) {
        ctx.addIssue({
            code: "custom",
            message: "Email or mobile number is required",
            path: [email]
        })
    }
})