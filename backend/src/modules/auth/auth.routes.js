import { Router } from "express";
import { registerOwnerController } from "./auth.controller.js";
import { ownerRegistrationSchema } from "./auth.validation.js";

const router = Router();
router.post("/register", (req, res, next) => {
    const result = ownerRegistrationSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        });
    }

    req.body = result.data;
    next();

}, registerOwnerController);

export default router;