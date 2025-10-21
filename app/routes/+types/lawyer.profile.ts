import type { components } from "../../lib/api/types/api";

export type Lawyer = components["schemas"]["Lawyer"] & {
  // Extend the base Lawyer type with any additional fields needed for the UI
  title?: string;
  experienceYears?: number;
  casesHandled?: number;
  isAvailable?: boolean;
  location?: string;
  education?: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  certifications?: Array<{
    name: string;
    issuingOrganization: string;
    year: number;
  }>;
  rating?: number;
};

export interface LoaderData {
  lawyer: Lawyer | null;
  error?: string;
}

export interface MetaArgs {
  loaderData: LoaderData;
}

export interface LoaderArgs {
  params: {
    lawyerId: string;
  };
}

export interface ComponentProps {
  loaderData: LoaderData;
}
