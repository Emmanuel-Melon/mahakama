import { Request, Response } from "express";
import { findOrgMembers } from "../operations/orgs.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { OrgMemberSerializer } from "../orgs.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import type { OrgMembersFilters } from "../orgs.types";

export const getOrgMembersController = asyncHandler(
  async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const query = req.query as unknown as OrgMembersFilters;
    const result = await findOrgMembers(orgId, query);
    return sendSuccessResponse(
      req,
      res,
      {
        data: result.data,
        serializerConfig: OrgMemberSerializer,
        type: "collection",
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: result.count,
        },
      },
    );
  },
);
