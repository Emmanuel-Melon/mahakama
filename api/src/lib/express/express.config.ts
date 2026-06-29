import {
  JsonApiResourceConfig,
  HealthCheckResponse,
  WelcomeResponse,
} from "./express.types";

export const HealthCheckSerializerConfig: JsonApiResourceConfig<HealthCheckResponse> =
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

export const WelcomeResponseSerializerConfig: JsonApiResourceConfig<WelcomeResponse> =
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
