import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateLawyer } from "../lawyers.update";
import { createMockLawyer, createMockNewLawyer } from "../../lawyers.factory";
import { mockDrizzleChain, mockDrizzleEmpty } from "@/tests/tests.utils";
import { db } from "@/lib/drizzle";

describe("updateLawyer", () => {
  const lawyerId = 123;
  const updateData = createMockNewLawyer({
    name: "Updated Name",
    specialization: "Family Law",
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should update a lawyer and return ok:true with updated lawyer", async () => {
    const existingLawyer = createMockLawyer({ id: `uuid-${lawyerId}` });
    const updateData = { name: "Updated Name" };

    // Setup mock to return "updated" version
    mockDrizzleChain([{ ...existingLawyer, ...updateData }]);
    const result = await updateLawyer(lawyerId, updateData as any);
    expect(result.ok).toBe(true);
    expect(result.data?.name).toBe("Updated Name");
    expect(db.update).toHaveBeenCalled();
  });

  it("should return ok:false if no lawyer was updated", async () => {
    // Zero plumbing, pure intent
    mockDrizzleEmpty();
    const result = await updateLawyer(lawyerId, updateData);
    expect(result).toEqual({ ok: false, data: null });
  });

  it("should throw if the database itself fails", async () => {
    // Setup the chain to explode at the end
    mockDrizzleChain("Connection Timeout", true);

    const lawyerId = 123;
    const updateData = { name: "New Name" };

    // Assert
    await expect(updateLawyer(lawyerId, updateData as any)).rejects.toThrow(
      "Connection Timeout",
    );
  });

  it("should handle partial updates correctly", async () => {
    const existingLawyer = createMockLawyer({
      id: `uuid-${lawyerId}`,
      name: "Original Name",
      specialization: "Criminal Law",
    });
    const partialUpdate = { specialization: "Family Law" };

    // Setup mock to return partially updated lawyer
    mockDrizzleChain([{ ...existingLawyer, ...partialUpdate }]);
    const result = await updateLawyer(lawyerId, partialUpdate as any);

    expect(result.ok).toBe(true);
    expect(result.data?.name).toBe("Original Name"); // unchanged
    expect(result.data?.specialization).toBe("Family Law"); // updated
    expect(db.update).toHaveBeenCalled();
  });
});
