import cors from "cors";
import { corsOrigins } from "@/config";

const corsOptions = {
  origin: corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export const corsMiddleware = cors(corsOptions);
