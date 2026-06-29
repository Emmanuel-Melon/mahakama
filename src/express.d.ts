import { UserAttrs } from "@/feature/users/user.middleware";
import { RequestFingerprint } from "@/lib/middleware/fingerprint";
import { User } from "@/feature/users/users.schema";
import useragent from "express-useragent";
import { PaginationParams } from "@/lib/express/express.types";

interface UserAgentInfo extends useragent.Details {
  ip: string;
  method: string;
  path: string;
  timestamp: Date;
  deviceType: "mobile" | "tablet" | "desktop";
}

declare global {
  namespace Express {
    interface Request {
      validatedParams?: any;
      validatedBody?: any;
      validatedQuery?: any;
      validatedHeaders?: any;
      validatedData?: UserAttrs;
      fingerprint?: RequestFingerprint;
      user?: User | null;
      userIP?: string;
      token?: string;
      requestId: string;
      userAgent?: UserAgentInfo;
      pagination: PaginationParams;
      file?: {
        originalname: string;
        size: number;
        buffer: Buffer;
        // Add other file properties as needed
      };
    }
  }
}
