import { Router } from "express";
import { registerOwnerController, loginController } from "./auth.controller.js";
import { ownerRegistrationSchema, loginSchema } from "./auth.validation.js";
import { authenticate } from "../../middlewares/auth.middleware.js"

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


router.post("/login", (req, res, next) => {
    const result = loginSchema.safeParse(req.body);
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

}, loginController);

// protected testing route
router.get("/protected-test",authenticate,  (req, res, next) => {

    return res.status(200).json({
        success: true,
        message: "Authentication successful",
        user: req.user
    });
});

export default router;