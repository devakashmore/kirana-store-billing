import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";

let server;

async function startServer() {
    try {
        const PORT = process.env.PORT;
        await connectDatabase();
        server = app.listen(PORT, (req, res) => {
            logger.info(
                `Kirana Store Billing API running on port ${env.PORT}`
            );
        });
    } catch (error) {
        logger.fatal({ err: error }, "Failed to start server");

        await disconnectDatabase().catch(() => { });
        process.exit(1);
    }
}

async function shutdown(signal) {
    logger.info(`${signal} received. Shutting down...`);
    if (server) {
        server.close(async (error) => {
            if (error) {
                logger.error({ err: error }, "HTTP server shutdown failed");
                process.exitCode = 1;
            }
            await disconnectDatabase();
            process.exit();
        });
    } else {
        await disconnectDatabase();
        process.exit();
    }
}


process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();