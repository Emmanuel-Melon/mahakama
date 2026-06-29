import { faker } from "@faker-js/faker";
import { User, NewUser } from "./users.types";
import { getRandomRole } from "./users.utils";
import { Genders } from "./users.schema";

export const randomGender = () =>
  faker.helpers.arrayElement(Object.values(Genders));

export const createMockUser = (overrides?: Partial<User>): User => {
  const gender = randomGender();
  const firstName = faker.person.firstName(gender as any);
  const lastName = faker.person.lastName();
  const email = faker.internet
    .email({ firstName, lastName, provider: "example.com" })
    .toLowerCase();

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email,
    password: "hashed-test-password", // plain string, we'll mock the hasher
    role: getRandomRole(0), // default role, can override
    fingerprint: null,
    userAgent: null,
    lastIp: null,
    isAnonymous: false,
    age: faker.number.int({ min: 18, max: 80 }),
    gender,
    country: faker.location.country(),
    city: faker.location.city(),
    phoneNumber: faker.phone.number(),
    occupation: faker.person.jobTitle(),
    bio: faker.lorem.paragraphs(2),
    profilePicture: null,
    isOnboarded: false,
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: faker.date.recent({ days: 30 }),
    ...overrides,
  };
};

export const createMockNewUser = (overrides?: Partial<NewUser>): NewUser => {
  const gender = randomGender();
  const firstName = faker.person.firstName(gender as any);
  const lastName = faker.person.lastName();
  const email = faker.internet
    .email({ firstName, lastName, provider: "example.com" })
    .toLowerCase();

  return {
    name: `${firstName} ${lastName}`,
    email,
    password: "plain-test-password", // raw password; will be hashed by the function
    role: "user", // default role
    fingerprint: null,
    userAgent: null,
    lastIp: null,
    isAnonymous: false,
    age: faker.number.int({ min: 18, max: 80 }),
    gender,
    country: faker.location.country(),
    city: faker.location.city(),
    phoneNumber: faker.phone.number(),
    occupation: faker.person.jobTitle(),
    bio: faker.lorem.paragraphs(2),
    profilePicture: null,
    isOnboarded: false,
    // id, createdAt, updatedAt are omitted
    ...overrides,
  };
};

export const createMockUsers = (
  count: number,
  overrides?: Partial<User>,
): User[] => {
  return Array.from({ length: count }, () => createMockUser(overrides));
};
