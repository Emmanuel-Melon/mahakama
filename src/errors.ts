import { HttpStatus } from "@/http-status";
import { AppError } from "@/lib/http/http.error";
import { ZodError } from "zod";

type ErrorResponseData = {
  status: (typeof HttpStatus)[keyof typeof HttpStatus];
  message: string;
  meta?: Record<string, any>;
};

export const mapErrorToResponse = (error: Error): ErrorResponseData => {
  if (error instanceof AppError) {
    const status =
      Object.values(HttpStatus).find(
        (s) => s.statusCode === error.statusCode,
      ) || HttpStatus.INTERNAL_SERVER_ERROR;

    return { status, message: error.message };
  }

  if (error instanceof ZodError) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: "Validation error",
      meta: { validationErrors: error.issues },
    };
  }
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred",
  };
};
