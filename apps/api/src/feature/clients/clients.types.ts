import { z } from "zod";
import { baseQuerySchema } from "@/lib/express/express.types";
import { type User } from "@/feature/users/users.types";

/*
 * CLIENT TYPES
 *
 * Clients are users who have matters with this lawyer.
 * We reuse the users types — no new tables are needed.
 */

export const clientQuerySchema = baseQuerySchema.extend({
  lawyerUserId: z.string().optional(),
});

export type Client = User;
export type ClientListParams = z.infer<typeof clientQuerySchema>;
export type ClientFilters = ClientListParams & {
  lawyerUserId: string;
};
