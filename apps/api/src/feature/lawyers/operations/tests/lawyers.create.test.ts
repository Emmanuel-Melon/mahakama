import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLawyer } from "../lawyers.create";
import { createMockLawyer, createMockNewLawyer } from "../../lawyers.factory";
import { mockDrizzleChain, mockDrizzleQuery } from "@/tests/tests.utils";
import { db } from "@/lib/drizzle";

describe("createLawyer", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create a lawyer and return ok:true with created lawyer", async () => {
    const mockCreatedLawyer = createMockLawyer();
    const newLawyerData = createMockNewLawyer({
      userId: mockCreatedLawyer.userId,
    });

    // Mock uniqueness check to return no existing lawyer
    mockDrizzleQuery("lawyers", "findFirst", undefined);
    // Mock insert chain
    mockDrizzleChain([mockCreatedLawyer]);

    const result = await createLawyer(newLawyerData);
    expect(result.ok).toBe(true);
    expect(result.data).toEqual(mockCreatedLawyer);
  });

  it("should return CONFLICT if a lawyer profile already exists for the user", async () => {
    const existingLawyer = createMockLawyer();
    const newLawyerData = createMockNewLawyer({
      userId: existingLawyer.userId,
    });

    // Mock uniqueness check to return existing lawyer
    mockDrizzleQuery("lawyers", "findFirst", { id: existingLawyer.id });

    const result = await createLawyer(newLawyerData);
    expect(result.ok).toBe(false);
    expect(result).toEqual({
      ok: false,
      data: null,
      reason: "A lawyer profile already exists for this user",
      type: "CONFLICT",
    });
    expect(db.insert).not.toHaveBeenCalled();
  });
});
