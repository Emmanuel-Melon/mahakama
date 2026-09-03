import { Request, Response } from "express";
import { insertOrg, insertOrgMember } from "../operations/orgs.insert";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { OrgSerializer } from "../orgs.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";
import type { NewOrg } from "../orgs.types";

export const createOrgController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body as NewOrg;
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const org = unwrap(
      await insertOrg({
        ...body,
        createdByUserId: userId,
      }),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to create org"),
    );

    // Auto-add creator as owner
    await insertOrgMember({
      orgId: org.id,
      userId,
      role: "owner",
      status: "active",
      joinedAt: new Date(),
    });

    return sendSuccessResponse(
      req,
      res,
      {
        data: org,
        serializerConfig: OrgSerializer,
        type: "single",
      },
      {
        status: HttpStatus.CREATED,
      },
    );
  },
);
