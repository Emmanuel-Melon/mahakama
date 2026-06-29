import { serverConfig, isDev } from "@/config";
import app from "@/app";
import { logger } from "@/lib/logger";
import { gracefulShutdown } from "@/lib/express/express.server";
import { initAllWorkers } from "@/lib/bullmq/bullmq.init";

if (require.main === module) {
  initAllWorkers();
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

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
}

export default app;
