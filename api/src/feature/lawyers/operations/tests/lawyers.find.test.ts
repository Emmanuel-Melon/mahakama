import { describe, it, expect, vi, beforeEach } from "vitest";
import { db } from "@/lib/drizzle";
import { findLawyerById } from "../lawyers.find";
import { createMockLawyer } from "../../lawyers.factory";
import { eq } from "drizzle-orm";
import { lawyersTable } from "../../lawyers.schema";
import { findLawyers } from "../lawyers.find";
import { createMockLawyers } from "../../lawyers.factory";
import { paginate } from "@/lib/drizzle/drizzle.paginate";
import { mockDrizzleQuery } from "@/tests/tests.utils";

vi.mock("@/lib/drizzle/drizzle.paginate");

describe("findLawyers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return paginated lawyers", async () => {
    const mockLawyers = createMockLawyers(5);
    const mockPaginatedResult = {
      data: mockLawyers,
      metadata: { total: 5, page: 1, limit: 10, totalPages: 1 },
    };

    vi.mocked(paginate).mockResolvedValue(mockPaginatedResult as any);

    const query = {
      page: 1,
      limit: 10,
      specialization: "Criminal Law",
      order: "asc" as const,
    };
    const result = await findLawyers(query);

    // toManyResult transforms the paginated result to DbManyResult
    expect(result).toEqual({
      data: mockLawyers,
      count: 5,
      isEmpty: false,
      metadata: mockPaginatedResult.metadata,
    });

    expect(paginate).toHaveBeenCalledWith(
      "lawyers",
      lawyersTable,
      expect.objectContaining({
        filters: expect.arrayContaining([
          eq(lawyersTable.specialization, "Criminal Law"),
        ]),
      }),
    );
  });

  it("should handle empty result", async () => {
    const mockPaginatedResult = {
      data: [],
      metadata: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };

    vi.mocked(paginate).mockResolvedValue(mockPaginatedResult as any);
    const query = {
      page: 0,
      limit: 0,
      order: "asc",
    } as const;
    const result = await findLawyers(query);

    expect(result).toEqual({
      data: [],
      count: 0,
      isEmpty: true,
      metadata: mockPaginatedResult.metadata,
    });
  });
});

describe("findLawyerById", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("should return ok:true with lawyer data", async () => {
    const mockLawyer = createMockLawyer();
    mockDrizzleQuery("lawyers", "findFirst", mockLawyer);
    const result = await findLawyerById(mockLawyer.id);
    expect(result).toEqual({ ok: true, data: mockLawyer });
  });

  it("should return ok:false with null data when lawyer not found", async () => {
    // Mock findFirst to return undefined (no lawyer found)
    vi.mocked(db.query.lawyers.findFirst).mockResolvedValue(undefined);

    const result = await findLawyerById("non-existent-id");

    expect(result).toEqual({ ok: false, data: null });
    expect(db.query.lawyers.findFirst).toHaveBeenCalledWith({
      where: eq(lawyersTable.id, "non-existent-id"),
    });
  });
});
