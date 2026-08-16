import { Router } from "express";
import { z } from "zod";

import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import type { ApiManifest } from "@/routes/api.types";

import { addInstitutionController } from "./controllers/add-institution.controller";
import { addServiceController } from "./controllers/add-service.controller";
import { getInstitutionByIdController } from "./controllers/get-institution.controller";
import { getInstitutionsController } from "./controllers/get-institutions.controller";
import { getLegalServiceByIdController } from "./controllers/get-service-by-id.controller";
import { getLegalServicesController } from "./controllers/get-services.controller";
import { serviceInsertSchema } from "./services.types";

const servicesRouter = Router();

servicesRouter.get("/", getLegalServicesController);
servicesRouter.get(
  "/:serviceId",
  validateHttpRequest(z.object({ serviceId: z.string() }), HttpLocation.Params),
  getLegalServiceByIdController,
);
servicesRouter.get("/institutions", getInstitutionsController);
servicesRouter.get(
  "/institutions/:institutionId",
  validateHttpRequest(
    z.object({ institutionId: z.string() }),
    HttpLocation.Params,
  ),
  getInstitutionByIdController,
);
servicesRouter.post(
  "/",
  validateHttpRequest(serviceInsertSchema, HttpLocation.Body),
  addServiceController,
);
servicesRouter.post("/institutions", addInstitutionController);

export const servicesApi: ApiManifest = {
  path: "/v1/services",
  router: servicesRouter,
};

export { servicesRouter };
