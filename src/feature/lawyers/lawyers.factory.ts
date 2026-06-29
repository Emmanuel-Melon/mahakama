import { faker } from "@faker-js/faker";
import { Lawyer, NewLawyer } from "@/feature/lawyers/lawyers.types";

export const createMockLawyer = (overrides?: Partial<Lawyer>): Lawyer => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  specialization: faker.helpers.arrayElement([
    "Criminal Law",
    "Family Law",
    "Corporate Law",
    "Tax",
  ]),
  location: faker.location.city(),
  experienceYears: faker.number.int({ min: 1, max: 30 }),
  rating: faker.number.float({ min: 1, max: 5 }).toString(),
  casesHandled: faker.number.int({ min: 0, max: 1000 }),
  isAvailable: faker.datatype.boolean(),
  languages: [faker.helpers.arrayElement(["English", "Luganda", "Swahili"])],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockNewLawyer = (
  overrides?: Partial<NewLawyer>,
): NewLawyer => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  specialization: faker.helpers.arrayElement([
    "Criminal Law",
    "Family Law",
    "Corporate Law",
    "Tax",
  ]),
  location: faker.location.city(),
  experienceYears: faker.number.int({ min: 1, max: 30 }),
  rating: faker.number.float({ min: 1, max: 5 }).toString(),
  languages: [faker.helpers.arrayElement(["English", "Luganda", "Swahili"])],
  // Optional fields: by default we omit them, but they can be overridden if needed
  // casesHandled, isAvailable, etc. are left undefined to test defaults
  ...overrides,
});

export const createMockLawyers = (
  count: number,
  overrides?: Partial<Lawyer>,
): Lawyer[] => {
  return Array.from({ length: count }, () => createMockLawyer(overrides));
};
