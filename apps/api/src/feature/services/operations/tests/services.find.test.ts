import { describe, it, expect, vi, beforeEach } from "vitest";
import { findService } from "../services.find";
import { createMockService } from "../../services.factory";
import { mockDrizzleQuery } from "@/tests/tests.utils";

describe("findService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return ok:true with service", async () => {
    const mockService = createMockService({ slug: "passport-renewal" });

    mockDrizzleQuery("servicesSchema", "findFirst", mockService);
    const result = await findService("slug", "passport-renewal");

    expect(result).toEqual({ ok: true, data: mockService });
    expect(result.data?.slug).toBe("passport-renewal");
  });

  it("should return ok:false when service is not found", async () => {
    mockDrizzleQuery("servicesSchema", "findFirst", undefined);

    const result = await findService("slug", "non-existent");

    expect(result).toEqual({ ok: false, data: null });
  });
});
