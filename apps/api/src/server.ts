import { serverConfig, isDev } from "@/config";
import app from "@/app";
import { logger } from "@/lib/logger";
import { gracefulShutdown } from "@/lib/express/express.server";
import { initAllWorkers } from "@/lib/bullmq/bullmq.init";
import { initNotifications } from "./feature/notifications/notifications.init";

const startServer = async () => {
  if (require.main === module) {
    await initAllWorkers();
    initNotifications();
    const server = app.listen(serverConfig.port, serverConfig.hostname, () => {
      const baseUrl = `${serverConfig.protocol}://${serverConfig.hostname}:${serverConfig.port}`;
      if (isDev) {
        const { endpoints } = serverConfig;
        logger.info("\n🔗 Available Endpoints:");
        logger.info(`  🌐 API: ${baseUrl}${endpoints.api}`);
        logger.info(`  📚 Documentation: ${baseUrl}${endpoints.docs}`);
        logger.info(`  📄 OpenAPI Spec: ${baseUrl}${endpoints.openApiSpec}`);
        logger.info(
          `  💓 Health Check: ${baseUrl}${endpoints.api}${endpoints.health}`,
        );
      }
    });
  }
};

startServer();

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export default app;
