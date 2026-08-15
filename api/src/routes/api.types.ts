import { RequestHandler, Router } from "express";

export interface ApiManifest {
  isPrivate?: boolean;
  middlewares?: RequestHandler[];
  path: string;
  router: Router;
}
