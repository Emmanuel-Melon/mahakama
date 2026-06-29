import { vi } from "vitest";

// 1. Mock the config
vi.mock("@/config", async () => {
  // We import inside the factory to avoid hoisting issues
  const { testConfig } = await import("@/config/test.config");
  return {
    ...testConfig,
    dbConfig: testConfig.db, // Mapping the keys your app expects
    serverConfig: testConfig.server,
  };
});

// 2. Mock Drizzle globally for all unit tests
vi.mock("@/lib/drizzle", () => {
  const mockQuery = { findMany: vi.fn(), findFirst: vi.fn() };
  return {
    db: {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      query: {
        lawyers: mockQuery,
        usersSchema: mockQuery,
        servicesSchema: mockQuery,
      },
    },
    closeDb: vi.fn().mockResolvedValue(undefined),
  };
});
