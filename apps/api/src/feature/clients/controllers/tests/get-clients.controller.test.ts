import { describe, it, expect, beforeAll } from "vitest";
import { authedRequest, expectSuccess } from "@/tests/tests.requests";
import { generateTestToken } from "@/tests/tests.auth";
import { truncateTables } from "@/tests/tests.utils";
import { createUser } from "@/feature/users/operations/users.insert";
import { createLawyer } from "@/feature/lawyers/operations/lawyers.create";
import {
  insertMatter,
  insertMatterLawyer,
} from "@/feature/matter/operations/matter.insert";

describe("GET /api/v1/clients", () => {
  let token: string;

  beforeAll(async () => {
    await truncateTables(["users", "lawyers", "matters", "matter_lawyers"]);

    const lawyerUserResult = await createUser({
      email: "lawyer@example.com",
      name: "Test Lawyer",
      password: "hashed_password",
    });
    if (!lawyerUserResult.ok || !lawyerUserResult.data) {
      throw new Error("Failed to create lawyer user");
    }
    const lawyerUser = lawyerUserResult.data;

    const lawyerResult = await createLawyer({
      userId: lawyerUser.id,
      specialization: "Criminal Law",
      experienceYears: 5,
      location: "Kampala",
      languages: ["English"],
    });
    if (!lawyerResult.ok || !lawyerResult.data) {
      throw new Error("Failed to create lawyer profile");
    }
    const lawyer = lawyerResult.data;

    const clientUserResult = await createUser({
      email: "client@example.com",
      name: "Test Client",
      password: "hashed_password",
    });
    if (!clientUserResult.ok || !clientUserResult.data) {
      throw new Error("Failed to create client user");
    }
    const clientUser = clientUserResult.data;

    const matterResult = await insertMatter({
      clientUserId: clientUser.id,
      title: "Test Matter",
    });
    if (!matterResult.ok || !matterResult.data) {
      throw new Error("Failed to create matter");
    }
    const matter = matterResult.data;

    const linkResult = await insertMatterLawyer({
      matterId: matter.id,
      lawyerId: lawyer.id,
    });
    if (!linkResult.ok || !linkResult.data) {
      throw new Error("Failed to link lawyer to matter");
    }

    token = generateTestToken(lawyerUser);
  });

  it("should return 200 with the lawyer's clients", async () => {
    const response = await authedRequest(token).get("/api/v1/clients");
    expectSuccess(response, 200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});
