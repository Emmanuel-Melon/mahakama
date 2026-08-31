import { Router } from "express";
import { getClientsController } from "./controllers/get-clients.controller";
import { useAuthorization } from "@/routes/api.rules";
import type { ApiManifest } from "@/routes/api.types";

const clientsRouter = Router();

useAuthorization(clientsRouter, [{ path: "/", roles: ["lawyer"] }]);

clientsRouter.get("/", getClientsController);

export const clientsApi: ApiManifest = {
  path: "/v1/clients",
  router: clientsRouter,
};

export default clientsRouter;
