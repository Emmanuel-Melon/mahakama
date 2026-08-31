import { describe, it, expect, vi, beforeEach } from "vitest";
import { db } from "@/lib/drizzle";
import { findClients } from "../clients.find";
import { createMockClients } from "../../clients.factory";
import { createMockLawyer } from "@/feature/lawyers/lawyers.factory";
import { mockDrizzleQuery } from "@/tests/tests.utils";

describe("findClients", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return empty when the lawyer does not exist", async () => {
    vi.mocked(db.query.lawyers.findFirst).mockResolvedValue(undefined);

    const result = await findClients({ lawyerUserId: "lawyer-user-id" });

    expect(result).toEqual({ data: [], count: 0, isEmpty: true });
  });

  it("should return empty when the lawyer has no matters", async () => {
    const lawyer = createMockLawyer();
    vi.mocked(db.query.lawyers.findFirst).mockResolvedValue(lawyer as any);

    const selectSpy = {
      from: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([] as any),
    };
    vi.mocked(db.selectDistinct).mockReturnValue(selectSpy as any);

    const result = await findClients({ lawyerUserId: lawyer.userId });

    expect(result).toEqual({ data: [], count: 0, isEmpty: true });
  });

  it("should return the distinct client users", async () => {
    const lawyer = createMockLawyer();
    const clients = createMockClients(3);

    vi.mocked(db.query.lawyers.findFirst).mockResolvedValue(lawyer as any);

    const clientUserIds = clients.map((c) => ({ clientUserId: c.id }));
    const selectSpy = {
      from: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(clientUserIds as any),
    };
    vi.mocked(db.selectDistinct).mockReturnValue(selectSpy as any);

    mockDrizzleQuery("usersSchema", "findMany", clients);

    const result = await findClients({ lawyerUserId: lawyer.userId });

    expect(result).toEqual({
      data: clients,
      count: clients.length,
      isEmpty: false,
    });

    expect(selectSpy.innerJoin).toHaveBeenCalledTimes(1);
    expect(selectSpy.where).toHaveBeenCalledTimes(1);
  });
});
