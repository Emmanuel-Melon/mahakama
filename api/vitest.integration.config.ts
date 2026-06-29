import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/feature/**/controllers/**/*.test.ts"],
    setupFiles: ["./src/tests/tests.integration.setup.ts"],
    env: {
      NODE_ENV: "test",
      BASE_URL: "http://localhost:3000",
      JWT_SECRET: "secret",
      PORT: "3000",
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});