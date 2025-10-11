export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Certification {
  name: string;
  issuingOrganization: string;
  year: number;
}

export interface Lawyer {
  id: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  rating: number;
  location: string;
  experienceYears: number;
  casesHandled: number;
  languages: string[];
  isAvailable: boolean;
  education: Education[];
  certifications: Certification[];
  email: string;
  phone: string;
}

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
