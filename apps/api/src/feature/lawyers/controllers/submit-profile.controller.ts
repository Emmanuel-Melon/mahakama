import { Request, Response } from "express";
import { submitLawyerProfile } from "../operations/lawyers.submit";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedLawyer } from "../lawyers.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { type User } from "@/feature/users/users.schema";

export const submitProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as User;

    const lawyer = unwrap(
      await submitLawyerProfile(user.id),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to submit lawyer profile",
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
