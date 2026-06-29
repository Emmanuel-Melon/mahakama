import { faker } from "@faker-js/faker";
import { LegalService, NewLegalService } from "./services.types";

export const createMockService = (
  overrides?: Partial<LegalService>,
): LegalService => {
  const category = faker.helpers.arrayElement([
    "all",
    "government",
    "legal-aid",
    "dispute-resolution",
    "specialized",
  ]);
  const name = faker.commerce.productName();
  const description = faker.lorem.paragraphs(2);

  return {
    id: faker.string.uuid(),
    name,
    description,
    categoryId: category,
    slug: faker.string.uuid(),
    // createdAt, updatedAt are omitted
    ...overrides,
  };
};

export const createMockNewService = (
  overrides?: Partial<NewLegalService>,
): NewLegalService => {
  const category = faker.helpers.arrayElement([
    "all",
    "government",
    "legal-aid",
    "dispute-resolution",
    "specialized",
  ]);
  const name = faker.commerce.productName();
  const description = faker.lorem.paragraphs(2);

  return {
    name,
    description,
    categoryId: category,
    slug: faker.string.uuid(),
    // id, createdAt, updatedAt are omitted
    ...overrides,
  };
};

export const createMockServices = (
  count: number,
  overrides?: Partial<LegalService>,
): LegalService[] => {
  return Array.from({ length: count }, () => createMockService(overrides));
};
