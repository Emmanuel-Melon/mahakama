import { describe, it, expect, vi, beforeEach } from "vitest";
import { createService } from "../services.create";
import {
  createMockNewService,
  createMockService,
} from "../../services.factory";
import { ConflictError } from "@/lib/http/http.error";
import { db } from "@/lib/drizzle";
import { PG_ERROR_CODES } from "@/lib/drizzle/drizzle.errors";
import { mockDrizzleChain } from "@/tests/tests.utils";

describe("createService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should successfully create a service", async () => {
    const newService = createMockNewService();
    const mockCreated = createMockService(newService);
    mockDrizzleChain([mockCreated]);
    const result = await createService(newService);
    expect(result.ok).toBe(true);
    expect(result.data?.slug).toBe(newService.slug);
    expect(db.insert).toHaveBeenCalled();
  });

  it("should throw ConflictError via the wrapper", async () => {
    const newService = createMockNewService({ slug: "dup" });

    // Setup the mock to fail with the Postgres code
    const dbError = new Error();
    (dbError as any).code = PG_ERROR_CODES.UNIQUE_VIOLATION;
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockRejectedValue(dbError),
      }),
    } as any);
    await expect(createService(newService)).rejects.toThrow(ConflictError);
  });
});
