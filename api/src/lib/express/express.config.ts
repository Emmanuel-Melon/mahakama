import {
  HealthCheckResponse,
  JsonApiResourceConfig,
  WelcomeResponse,
} from "./express.types";

export const healthCheckSerializerConfig: JsonApiResourceConfig<HealthCheckResponse> =
  {
    type: "health-check",
    attributes: (field) => ({
      status: field.status,
      message: field.message,
      environment: field.environment,
      timestamp: field.timestamp,
      services: field.services,
    }),
  };

export const welcomeResponseSerializerConfig: JsonApiResourceConfig<WelcomeResponse> =
  {
    type: "welcome",
    attributes: (field) => ({
      message: field.message,
      documentation: field.documentation,
      environment: field.environment,
      timestamp: field.timestamp,
      status: field.status,
      endpoints: field.endpoints,
    }),
  };
