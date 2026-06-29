import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUser } from "../users.update";
import { createMockUser } from "../../users.factory";
import { mockDrizzleChain, mockDrizzleEmpty } from "@/tests/tests.utils";

describe("updateUser", () => {
  const userId = "user-123";
  const updateData = { name: "Updated Name", age: 35 };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should update user and return ok:true with updated user", async () => {
    const existingUser = createMockUser({ id: userId });
    const updateData = { name: "Updated Name" };

    // Setup mock chain to return "updated" version
    mockDrizzleChain([{ ...existingUser, ...updateData }]);
    const result = await updateUser(userId, updateData);
    expect(result.ok).toBe(true);
    expect(result.data?.name).toBe("Updated Name");
  });

  it("should return ok:false if no user was updated", async () => {
    mockDrizzleEmpty();
    const result = await updateUser(userId, updateData);
    expect(result).toEqual({ ok: false, data: null });
  });
});
