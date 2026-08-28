import { faker } from "@faker-js/faker";
import {
  Lawyer,
  NewLawyer,
  LawyerInvite,
  NewLawyerInvite,
  LawyerProfileDocument,
  NewLawyerProfileDocument,
} from "@/feature/lawyers/lawyers.types";

export const createMockLawyer = (overrides?: Partial<Lawyer>): Lawyer => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  status: faker.helpers.arrayElement([
    "draft",
    "submitted",
    "approved",
    "rejected",
  ]),
  specialization: faker.helpers.arrayElement([
    "Criminal Law",
    "Family Law",
    "Corporate Law",
    "Tax",
  ]),
  experienceYears: faker.number.int({ min: 1, max: 30 }),
  rating: faker.number.float({ min: 1, max: 5 }).toString(),
  casesHandled: faker.number.int({ min: 0, max: 1000 }),
  isAvailable: faker.datatype.boolean(),
  location: faker.location.city(),
  languages: [faker.helpers.arrayElement(["English", "Luganda", "Swahili"])],
  bio: faker.lorem.paragraph(),
  barNumber: faker.string.alphanumeric(10),
  issuingAuthority: faker.company.name(),
  jurisdiction: faker.location.country(),
  education: [
    {
      institution: faker.company.name(),
      degree: "LLB",
      year: faker.number.int({ min: 2000, max: 2024 }),
    },
  ],
  submittedAt: null,
  reviewedBy: null,
  reviewedAt: null,
  rejectionReason: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockNewLawyer = (
  overrides?: Partial<NewLawyer>,
): NewLawyer => ({
  userId: faker.string.uuid(),
  specialization: faker.helpers.arrayElement([
    "Criminal Law",
    "Family Law",
    "Corporate Law",
    "Tax",
  ]),
  experienceYears: faker.number.int({ min: 1, max: 30 }),
  location: faker.location.city(),
  languages: [faker.helpers.arrayElement(["English", "Luganda", "Swahili"])],
  ...overrides,
});

export const createMockLawyers = (
  count: number,
  overrides?: Partial<Lawyer>,
): Lawyer[] => {
  return Array.from({ length: count }, () => createMockLawyer(overrides));
};

export const createMockLawyerInvite = (
  overrides?: Partial<LawyerInvite>,
): LawyerInvite => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  invitedBy: faker.string.uuid(),
  token: faker.string.alphanumeric(32),
  status: "pending",
  expiresAt: faker.date.future(),
  acceptedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockNewLawyerInvite = (
  overrides?: Partial<NewLawyerInvite>,
): NewLawyerInvite => ({
  email: faker.internet.email(),
  invitedBy: faker.string.uuid(),
  token: faker.string.alphanumeric(32),
  expiresAt: faker.date.future(),
  ...overrides,
});

export const createMockLawyerProfileDocument = (
  overrides?: Partial<LawyerProfileDocument>,
): LawyerProfileDocument => ({
  id: faker.string.uuid(),
  lawyerProfileId: faker.string.uuid(),
  type: faker.helpers.arrayElement(["bar_certificate", "national_id", "other"]),
  fileUrl: faker.internet.url(),
  uploadedAt: new Date(),
  ...overrides,
});

export const createMockNewLawyerProfileDocument = (
  overrides?: Partial<NewLawyerProfileDocument>,
): NewLawyerProfileDocument => ({
  lawyerProfileId: faker.string.uuid(),
  type: faker.helpers.arrayElement(["bar_certificate", "national_id", "other"]),
  fileUrl: faker.internet.url(),
  ...overrides,
});
