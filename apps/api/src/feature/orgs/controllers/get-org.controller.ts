import { Request, Response } from "express";
import { findOrg } from "../operations/orgs.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { OrgSerializer } from "../orgs.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getOrgController = asyncHandler(
  async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const org = unwrap(
      await findOrg("id", orgId),
      new HttpError(HttpStatus.NOT_FOUND, "Org not found"),
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
