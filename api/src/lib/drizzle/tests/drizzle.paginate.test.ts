import { describe, it, expect, vi, beforeEach } from "vitest";
import { paginate } from "../drizzle.paginate";
import { db } from "../index";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";

vi.mock("@/lib/drizzle", () => ({
  db: {
    query: {
      lawyers: {
        findMany: vi.fn(),
      },
    },
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn(),
  },
}));

describe("paginate", () => {
  it("should return paginated data and metadata", async () => {
    const mockData = [{ id: 1, name: "Lawyer 1" }];
    const mockCount = [{ count: 1 }];

    vi.mocked(db.query.lawyers.findMany).mockResolvedValue(mockData as any);
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(mockCount),
      }),
    } as any);

    const result = await paginate("lawyers", lawyersTable, {
      page: 1,
      limit: 10,
    });

    expect(result.data).toEqual(mockData);
    expect(result.metadata).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });
});
