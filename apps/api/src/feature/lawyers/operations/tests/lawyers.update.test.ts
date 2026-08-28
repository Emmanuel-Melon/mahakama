import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateLawyer } from "../lawyers.update";
import { createMockLawyer, createMockNewLawyer } from "../../lawyers.factory";
import { mockDrizzleChain, mockDrizzleEmpty } from "@/tests/tests.utils";
import { db } from "@/lib/drizzle";

describe("updateLawyer", () => {
  const lawyerId = "test-lawyer-id";
  const updateData = createMockNewLawyer({
    specialization: "Family Law",
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should update a lawyer and return ok:true with updated lawyer", async () => {
    const existingLawyer = createMockLawyer({ id: lawyerId });
    const updateData = { specialization: "Family Law" };

    mockDrizzleChain([{ ...existingLawyer, ...updateData }]);
    const result = await updateLawyer("id", lawyerId, updateData as any);
    expect(result.ok).toBe(true);
    expect(result.data?.specialization).toBe("Family Law");
    expect(db.update).toHaveBeenCalled();
  });

  it("should return ok:false if no lawyer was updated", async () => {
    mockDrizzleEmpty();
    const result = await updateLawyer("id", lawyerId, updateData);
    expect(result).toEqual({
      ok: false,
      data: null,
      reason: "Resource not found",
      type: "NOT_FOUND",
    });
  });

  it("should throw if the database itself fails", async () => {
    mockDrizzleChain("Connection Timeout", true);

    const result = await updateLawyer("id", lawyerId, {
      bio: "New bio",
    } as any);
    expect(result).toEqual({
      ok: false,
      data: null,
      reason: "Connection Timeout",
      type: "DATABASE_ERROR",
    });
  });

  it("should handle partial updates correctly", async () => {
    const existingLawyer = createMockLawyer({
      id: lawyerId,
      specialization: "Criminal Law",
      bio: "Original bio",
    });
    const partialUpdate = { specialization: "Family Law" };

    mockDrizzleChain([{ ...existingLawyer, ...partialUpdate }]);
    const result = await updateLawyer("id", lawyerId, partialUpdate as any);

    expect(result.ok).toBe(true);
    expect(result.data?.bio).toBe("Original bio");
    expect(result.data?.specialization).toBe("Family Law");
    expect(db.update).toHaveBeenCalled();
  });
});
