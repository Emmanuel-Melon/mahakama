import { Request, Response, NextFunction } from "express";
import { AsyncRouteHandler } from "./express.types";

export const asyncHandler = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
