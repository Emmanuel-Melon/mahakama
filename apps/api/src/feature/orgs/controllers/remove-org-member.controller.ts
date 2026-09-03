import { Request, Response } from "express";
import { findOrgMember } from "../operations/orgs.find";
import { deleteOrgMember } from "../operations/orgs.delete";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { OrgMemberSerializer } from "../orgs.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const removeOrgMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const userId = req.params.userId as string;

    unwrap(
      await findOrgMember(orgId, userId),
      new HttpError(HttpStatus.NOT_FOUND, "Org member not found"),
    );

    const member = unwrap(
      await deleteOrgMember(orgId, userId),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to remove org member"),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: member,
        serializerConfig: OrgMemberSerializer,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
