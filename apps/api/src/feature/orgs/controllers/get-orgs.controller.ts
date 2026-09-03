import { Request, Response } from "express";
import { findOrgs } from "../operations/orgs.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { OrgSerializer } from "../orgs.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import type { OrgsFilters } from "../orgs.types";

export const getOrgsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const query = req.query as unknown as OrgsFilters;
    const result = await findOrgs({ ...query, userId });
    return sendSuccessResponse(
      req,
      res,
      {
        data: result.data,
        serializerConfig: OrgSerializer,
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
