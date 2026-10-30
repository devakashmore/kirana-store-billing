import { Router } from "express";
import { prisma } from "../../config/database.js";

const router = Router();
router.get("/", async (req, res) => {

    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
        success: true,
        message: "Kirana Store Billing API is running",
        data: {
            server: "healthy",
            database: "connected",
            timestamp: new Date().toISOString()
        }
    });
});

export default router;


// import { Router } from "express";
// import { prisma } from "../../config/database.js";

// const router = Router();

// router.get("/", async (req, res) => {
//     await prisma.$queryRaw`SELECT 1`;

//     return res.status(200).json({
//         success: true,
//         message: "Kirana Store Billing API is running",
//         data: {
//             server: "healthy",
//             database: "connected",
//             timestamp: new Date().toISOString()
//         }
//     });
// });

// export default router;