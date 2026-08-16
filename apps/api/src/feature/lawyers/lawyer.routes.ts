import { Router } from "express";
import { z } from "zod";

import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import type { ApiManifest } from "@/routes/api.types";

import { createLawyerController } from "./controllers/create-lawyer.controller";
import { getLawyerByIdController } from "./controllers/get-lawyer-by-id.controller";
import { getLawyersController } from "./controllers/get-lawyers.controller";
import { updateLawyerController } from "./controllers/update-lawyer.controller";
import { createLawyerSchema } from "./lawyers.types";

const lawyersRoutes = Router();

lawyersRoutes.get("/", getLawyersController);
lawyersRoutes.get(
  "/:id",
  validateHttpRequest(z.object({ id: z.string() }), HttpLocation.Params),
  getLawyerByIdController,
);
lawyersRoutes.post(
  "/",
  validateHttpRequest(createLawyerSchema, HttpLocation.Body),
  createLawyerController,
);
lawyersRoutes.put(
  "/:id",
  validateHttpRequest(z.object({ id: z.string() }), HttpLocation.Params),
  validateHttpRequest(createLawyerSchema.partial(), HttpLocation.Body),
  updateLawyerController,
);

export const lawyersApi: ApiManifest = {
  path: "/v1/lawyers",
  router: lawyersRoutes,
};

export default lawyersRoutes;
