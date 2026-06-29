import { Request } from "express";
import { BaseQueryParams, baseQuerySchema } from "./express.types";

export const parsePagination = (req: Request): BaseQueryParams => {
  return baseQuerySchema.parse(req.query);
};
