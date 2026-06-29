import { JsonApiResourceConfig } from "@/lib/express/express.types";
import {
  LegalService,
  serviceSelectSchema,
  Institution,
  institutionSelectSchema,
} from "./services.types";

export const SerializedLegalService: JsonApiResourceConfig<LegalService> = {
  type: "legal-service",
  attributes: (service: LegalService) => serviceSelectSchema.parse(service),
};

export const SerializedInstitution: JsonApiResourceConfig<Institution> = {
  type: "institution",
  attributes: (institution: Institution) =>
    institutionSelectSchema.parse(institution),
};

export const LegalServiceEvents = {
  ServiceCreated: "legal-service-created",
  ServiceUpdated: "legal-service-updated",
  ServiceDeleted: "legal-service-deleted",
} as const;

export type LegalServicesJobType =
  (typeof LegalServiceEvents)[keyof typeof LegalServiceEvents];
