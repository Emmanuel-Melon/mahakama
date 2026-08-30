import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { dbConfig } from "./src/config";

config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./src/feature/**/*.schema.ts",
    "./src/service/**/*.schema.ts",
    "./src/feature/**/*.enums.ts",
    "./src/service/**/*.enums.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: dbConfig.postgres.url,
  },
});
