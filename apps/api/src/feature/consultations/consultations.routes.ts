import { Router } from "express";
import { z } from "zod";
import { requestConsultationController } from "./controllers/request-consultation.controller";
import { acceptConsultationController } from "./controllers/accept-consultation.controller";
import { getConsultationsController } from "./controllers/get-consultations.controller";
import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import {
  createConsultationSchema,
  declineConsultationSchema,
} from "./consultations.types";
import type { ApiManifest } from "@/routes/api.types";
import { useAuthorization } from "@/routes/api.rules";
import { closeConsultationController } from "./controllers/close-consultation.controller";
import { declineConsultationController } from "./controllers/decline-consultation.controller";
import { getConsultationController } from "./controllers/get-consultation.controller";

const consultationsRouter = Router();

const idParamSchema = z.object({ id: z.string() });

useAuthorization(consultationsRouter, [
  { path: "/", roles: ["lawyer", "admin", "user"] },
  { path: "/:id", roles: ["lawyer", "admin", "user"] },
  { path: "/:id/accept", roles: ["lawyer", "admin"] },
  { path: "/:id/decline", roles: ["lawyer", "admin"] },
  { path: "/:id/close", roles: ["lawyer", "admin", "user"] },
]);

consultationsRouter.get("/", getConsultationsController);
consultationsRouter.get(
  "/:id",
  validateHttpRequest(idParamSchema, HttpLocation.Params),
  getConsultationController,
);
consultationsRouter.post(
  "/",
  validateHttpRequest(createConsultationSchema, HttpLocation.Body),
  requestConsultationController,
);
consultationsRouter.patch(
  "/:id/accept",
  validateHttpRequest(idParamSchema, HttpLocation.Params),
  acceptConsultationController,
);
consultationsRouter.patch(
  "/:id/decline",
  validateHttpRequest(idParamSchema, HttpLocation.Params),
  validateHttpRequest(declineConsultationSchema, HttpLocation.Body),
  declineConsultationController,
);
consultationsRouter.patch(
  "/:id/close",
  validateHttpRequest(idParamSchema, HttpLocation.Params),
  closeConsultationController,
);

export const consultationsApi: ApiManifest = {
  path: "/v1/consultations",
  router: consultationsRouter,
};

export default consultationsRouter;
