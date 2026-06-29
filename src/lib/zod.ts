import { ZodError, ZodSchema } from "zod";
export interface ValidationResult<T = any> {
  success: true;
  data: T;
}

export const formatZodErrors = (error: ZodError) => {
  return error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
    code: err.code,
  }));
};

export interface ValidationError {
  success: false;
  error: ZodError;
  formattedErrors: ReturnType<typeof formatZodErrors>;
}

export type ValidateWithZodResult<T> = ValidationResult<T> | ValidationError;

export const validateWithZod = <T>(
  data: any,
  schema: ZodSchema<T>,
): ValidateWithZodResult<T> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      formattedErrors: formatZodErrors(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};
