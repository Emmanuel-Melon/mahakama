import { Router } from "express";
import { getCurrentUserController } from "./controllers/get-current-user.controller";
import { getUsersController } from "./controllers/get-users.controller";
import { getUserController } from "./controllers/get-user.controller";
import { createUserController } from "./controllers/create-user.controller";
import { updateUserController } from "./controllers/update-user.controller";
import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import { usersUpdateSchema, usersInsertSchema } from "./users.types";
import { z } from "zod";
import type { ApiManifest } from "@/routes/api.types";

const usersRouter = Router();

usersRouter.get("/me", getCurrentUserController);
usersRouter.get("/", getUsersController);
usersRouter.get(
  "/:id",
  validateHttpRequest(z.object({ id: z.string() }), HttpLocation.Params),
  getUserController,
);
usersRouter.post(
  "/",
  validateHttpRequest(usersInsertSchema, HttpLocation.Body),
  createUserController,
);
usersRouter.patch(
  "/:id",
  validateHttpRequest(z.object({ id: z.string() }), HttpLocation.Params),
  validateHttpRequest(usersUpdateSchema, HttpLocation.Body),
  updateUserController,
);

export const usersApi: ApiManifest = {
  path: "/v1/users",
  router: usersRouter,
};

export default usersRouter;
