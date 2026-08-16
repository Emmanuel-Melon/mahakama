import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLawyer } from "../lawyers.create";
import { createMockLawyer } from "../../lawyers.factory";
import { mockDrizzleChain } from "@/tests/tests.utils";

describe("createLawyer", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create a lawyer and return ok:true with created lawyer", async () => {
    const mockCreatedLawyer = createMockLawyer();
    mockDrizzleChain([mockCreatedLawyer]);
    const result = await createLawyer(mockCreatedLawyer);
    expect(result.data).toEqual(mockCreatedLawyer);
  });
});
