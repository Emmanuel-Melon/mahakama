import { Request, Response } from "express";
import { findOrgMember } from "../operations/orgs.find";
import { updateOrgMember } from "../operations/orgs.update";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { OrgMemberSerializer } from "../orgs.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";
import type { UpdateOrgMember } from "../orgs.types";

export const updateOrgMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const userId = req.params.userId as string;
    const body = req.body as UpdateOrgMember;

    const existing = unwrap(
      await findOrgMember(orgId, userId),
      new HttpError(HttpStatus.NOT_FOUND, "Org member not found"),
    );

    // If accepting an invite, set joinedAt
    const updateData: UpdateOrgMember = {
      ...body,
      ...(body.status === "active" && !existing.joinedAt
        ? { joinedAt: new Date() }
        : {}),
    };

    const member = unwrap(
      await updateOrgMember("userId", userId, updateData),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to update org member"),
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
