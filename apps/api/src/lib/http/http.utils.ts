import { z } from "zod";

export function parseHttpData<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown,
):
  | { success: true; data: z.infer<TSchema> }
  | { success: false; errors: z.ZodIssue[] } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.issues };
  }
  return { success: true, data: result.data };
}
