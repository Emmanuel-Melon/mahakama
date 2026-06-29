import { Router } from "express";
import { getLawyersController } from "./controllers/get-lawyers.controller";
import { getLawyerByIdController } from "./controllers/get-lawyer-by-id.controller";
import { createLawyerController } from "./controllers/create-lawyer.controller";
import { updateLawyerController } from "./controllers/update-lawyer.controller";
import { validateRequestBody } from "@/middleware/request-validators";
import { createLawyerSchema } from "./lawyers.schema";

const lawyersRoutes = Router();

lawyersRoutes.get("/", getLawyersController);
lawyersRoutes.get("/:id", getLawyerByIdController);
lawyersRoutes.post(
  "/",
  validateRequestBody(createLawyerSchema),
  createLawyerController,
);
lawyersRoutes.put(
  "/:id",
  validateRequestBody(createLawyerSchema),
  updateLawyerController,
);

export default lawyersRoutes;

export const LAWYERS_PATH = "/v1/lawyers";
