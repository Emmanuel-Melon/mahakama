import { UserRole } from "@/feature/auth/auth.types";
import { TimeUnit } from "@/utils/dates";
import { RequestHandler, Router } from "express";

export interface RateLimitRule {
  amount: number;
  limit: number;
  path: string;
  unit: TimeUnit;
}

export interface SecurityRule {
  path: string;
  roles?: UserRole[];
}

export interface ApiManifest {
  isPrivate?: boolean;
  middlewares?: RequestHandler[];
  path: string;
  router: Router;
}

export interface WebhookDefinition {
  middleware: RequestHandler | RequestHandler[];
  path: string;
  processor: RequestHandler;
}