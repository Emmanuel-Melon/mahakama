import { Request, Response } from "express";
import { findClients } from "../operations/clients.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { ClientSerializer } from "../clients.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import type { ClientFilters } from "../clients.types";

export const getClientsController = asyncHandler(
  async (req: Request, res: Response) => {
    const lawyerUserId = req.user?.id || "";
    const query: ClientFilters = { lawyerUserId };
    const result = await findClients(query);
    return sendSuccessResponse(
      req,
      res,
      {
        data: result.data,
        serializerConfig: ClientSerializer,
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
