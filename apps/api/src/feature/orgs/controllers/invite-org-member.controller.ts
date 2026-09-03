import { Request, Response } from "express";
import { findOrg, findOrgMember } from "../operations/orgs.find";
import { insertOrgMember } from "../operations/orgs.insert";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { OrgMemberSerializer } from "../orgs.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const inviteOrgMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const body = req.body as { userId: string; role?: string };

    unwrap(
      await findOrg("id", orgId),
      new HttpError(HttpStatus.NOT_FOUND, "Org not found"),
    );

    if (!body.userId) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "User ID is required");
    }

    const existing = await findOrgMember(orgId, body.userId);
    if (existing.ok && existing.data) {
      throw new HttpError(
        HttpStatus.CONFLICT,
        "User is already a member of this org",
      );
    }

    const member = unwrap(
      await insertOrgMember({
        orgId,
        userId: body.userId,
        role: (body.role as "owner" | "admin" | "member") ?? "member",
        status: "invited",
      }),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to invite member"),
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
        status: HttpStatus.CREATED,
      },
    );
  },
);
