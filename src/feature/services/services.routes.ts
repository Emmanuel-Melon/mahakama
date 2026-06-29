import { Router } from "express";
import { getLegalServicesController } from "./controllers/get-services.controller";
import { getLegalServiceByIdController } from "./controllers/get-service-by-id.controller";
import { getInstitutionsController } from "./controllers/get-institutions.controller";
import { getInstitutionByIdController } from "./controllers/get-institution.controller";
import { addServiceController } from "./controllers/add-service.controller";
import { addInstitutionController } from "./controllers/add-institution.controller";

const servicesRouter = Router();

servicesRouter.get("/", getLegalServicesController);
servicesRouter.get("/:serviceId", getLegalServiceByIdController);
servicesRouter.get("/institutions", getInstitutionsController);
servicesRouter.get(
  "/institutions/:institutionId",
  getInstitutionByIdController,
);
servicesRouter.post("/", addServiceController);
servicesRouter.post("/institutions", addInstitutionController);

export { servicesRouter };

export const SERVICES_PATH = "/v1/services";
