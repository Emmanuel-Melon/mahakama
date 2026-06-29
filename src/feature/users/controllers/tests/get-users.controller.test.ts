import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { authedRequest, expectSuccess } from "@/tests/tests.requests";
import { generateTestToken } from "@/tests/tests.auth";
import { truncateTables } from "@/tests/tests.utils";
import { createUser } from "@/feature/users/operations/users.create";

let token: string;

describe("GET /api/v1/users", () => {
  beforeAll(async () => {
    await truncateTables(["users"]);
    const userResult = await createUser({
      email: "test@example.com",
      name: "Test User",
      password: "hashed_password",
      role: "user",
    });

    if (!userResult.ok || !userResult.data) {
      throw new Error("Failed to create test user");
    }

    token = generateTestToken(userResult.data);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 when users are successfully fetched", async () => {
    const response = await authedRequest(token).get("/api/v1/users");
    expectSuccess(response, 200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});
