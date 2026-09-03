import { Request, Response } from "express";
import { updateOrg } from "../operations/orgs.update";
import { findOrg } from "../operations/orgs.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { OrgSerializer } from "../orgs.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";
import type { UpdateOrg } from "../orgs.types";

export const updateOrgController = asyncHandler(
  async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const body = req.body as UpdateOrg;

    unwrap(
      await findOrg("id", orgId),
      new HttpError(HttpStatus.NOT_FOUND, "Org not found"),
    );

    const org = unwrap(
      await updateOrg("id", orgId, body),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to update org"),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: org,
        serializerConfig: OrgSerializer,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
