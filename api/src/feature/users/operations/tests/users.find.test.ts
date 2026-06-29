import { describe, it, expect, vi, beforeEach } from "vitest";
import { findUserById, findUsers } from "../users.find";
import { createMockUser, createMockUsers } from "../../users.factory";
import { usersSchema } from "../../users.schema";
import { paginate } from "@/lib/drizzle/drizzle.paginate";
import { mockDrizzleQuery } from "@/tests/tests.utils";

vi.mock("@/lib/drizzle/drizzle.paginate");

describe("findUserById", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return ok:true with user data when found", async () => {
    const mockUser = createMockUser({ id: "user-123" });
    mockDrizzleQuery("usersSchema", "findFirst", mockUser);
    const result = await findUserById("user-123");
    expect(result).toEqual({ ok: true, data: mockUser });
  });

  it("should return ok:false with null when user not found", async () => {
    mockDrizzleQuery("usersSchema", "findFirst", undefined);
    const result = await findUserById("non-existent");
    expect(result).toEqual({ ok: false, data: null });
  });
});

describe("findUsers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return paginated users", async () => {
    const mockUsers = createMockUsers(3);
    const mockPaginatedResult = {
      data: mockUsers,
      metadata: { total: 3, page: 1, limit: 10, totalPages: 1 },
    };
    vi.mocked(paginate).mockResolvedValue(mockPaginatedResult as any);

    const query = { page: 1, limit: 10, order: "asc" as const, role: "user" };
    const result = await findUsers(query);

    expect(result).toEqual({
      data: mockUsers,
      count: 3,
      isEmpty: false,
      metadata: mockPaginatedResult.metadata,
    });
    expect(paginate).toHaveBeenCalledWith(
      "usersSchema",
      usersSchema,
      expect.objectContaining({
        page: 1,
        limit: 10,
        order: "asc",
        filters: [expect.anything()], // role filter
        search: expect.any(Object),
      }),
    );
  });
});
