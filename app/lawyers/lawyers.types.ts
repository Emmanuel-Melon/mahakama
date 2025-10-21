export interface Language {
  id: number;
  name: string;
  code: string;
}

export interface Lawyer {
  id: number;
  name: string;
  email: string;
  specialization: string;
  experienceYears: number;
  rating: string;
  casesHandled: number;
  isAvailable: boolean;
  location: string;
  languages: Language[];
  createdAt: string;
  updatedAt: string;
  // Optional fields that might be present in some responses
  bio?: string;
  phoneNumber?: string;
  imageUrl?: string;
}
