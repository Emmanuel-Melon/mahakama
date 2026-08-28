import { Request, Response } from "express";
import { approveLawyer } from "../operations/lawyers.approve";
import { rejectLawyer } from "../operations/lawyers.reject";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedLawyer } from "../lawyers.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { type User } from "@/feature/users/users.schema";

export const approveLawyerController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const lawyerId = req.params.id as string;

    const lawyer = unwrap(
      await approveLawyer(lawyerId, user.id),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to approve lawyer",
      ),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: { ...lawyer, id: lawyer.id.toString() } as typeof lawyer & {
          id: string;
        },
        type: "single",
        serializerConfig: SerializedLawyer,
      },
      { status: HttpStatus.ACCEPTED },
    );
  },
);

export const rejectLawyerController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const lawyerId = req.params.id as string;
    const { rejectionReason } = req.body;

    const lawyer = unwrap(
      await rejectLawyer(lawyerId, user.id, rejectionReason),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to reject lawyer",
      ),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: { ...lawyer, id: lawyer.id.toString() } as typeof lawyer & {
          id: string;
        },
        type: "single",
        serializerConfig: SerializedLawyer,
      },
      { status: HttpStatus.ACCEPTED },
    );
  },
);
