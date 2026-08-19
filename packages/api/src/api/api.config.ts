import { z } from "zod";

export const ApiConfigSchema = z.object({
  baseURL: z.string().url(),
  timeout: z.number().int().min(0).default(5000),
  refreshEndpoint: z.string().min(1).default("/api/v1/auth/refresh"),
});

export type ApiConfig = z.infer<typeof ApiConfigSchema>;

let _runtimeConfig: ApiConfig | null = null;

export function configureApi(input: Partial<ApiConfig>) {
  _runtimeConfig = ApiConfigSchema.parse({ ..._runtimeConfig, ...input });
}

export function getApiConfig(): ApiConfig {
  if (!_runtimeConfig) {
    throw new Error(
      "API Config not initialized! Call configureApi() at app startup.",
    );
  }
  return _runtimeConfig;
}
