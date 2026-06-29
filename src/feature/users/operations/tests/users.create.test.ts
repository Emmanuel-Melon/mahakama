import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUser } from "../users.create";
import { createMockUser, createMockNewUser } from "../../users.factory";
import { mockDrizzleChain, mockDrizzleEmpty } from "@/tests/tests.utils";

describe("createUser", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create a user and return ok:true with created user", async () => {
    const newUser = createMockNewUser();
    const mockCreatedUser = createMockUser({ id: "new-id", ...newUser });

    mockDrizzleChain([mockCreatedUser]);
    const result = await createUser(newUser);
    expect(result.data).toEqual(mockCreatedUser);
  });

  it("should return ok:false if insert returns empty", async () => {
    mockDrizzleEmpty();
    const result = await createUser(createMockNewUser());
    expect(result).toEqual({ ok: false, data: null });
  });
});
