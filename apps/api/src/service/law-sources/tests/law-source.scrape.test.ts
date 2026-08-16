import { describe, it, expect } from "vitest";
import { parseDateToken, scrapeLastUpdated } from "../law-source.scrape";

describe("parseDateToken", () => {
  it("parses ISO dates", () => {
    expect(parseDateToken("2023-06-01")).toBe("2023-06-01");
    expect(parseDateToken("Last updated: 2023-6-1")).toBe("2023-06-01");
  });

  it("parses day-month-year with month names", () => {
    expect(parseDateToken("Last updated: 12 January 2024")).toBe("2024-01-12");
    expect(parseDateToken("12 Jan 2024")).toBe("2024-01-12");
    expect(parseDateToken("12 january 2024")).toBe("2024-01-12");
    expect(parseDateToken("3 Feb, 2024")).toBe("2024-02-03");
  });

  it("parses numeric day/month/year", () => {
    expect(parseDateToken("12/01/2024")).toBe("2024-01-12");
    expect(parseDateToken("12.01.2024")).toBe("2024-01-12");
    expect(parseDateToken("12-01-2024")).toBe("2024-01-12");
  });

  it("returns null for non-dates", () => {
    expect(parseDateToken("nope")).toBeNull();
    expect(parseDateToken("2024-99-99")).toBe("2024-99-99"); // shape accepted, not calendar-validated
  });
});

describe("scrapeLastUpdated", () => {
  it("finds a ULII-style footer", () => {
    const html = `
      <html><body>
        <h1>The Land Act</h1>
        <footer>Last updated: 15 August 2023</footer>
      </body></html>`;
    expect(scrapeLastUpdated(html)).toBe("2023-08-15");
  });

  it("finds an ISO date after the label", () => {
    const html = `...Last updated 2023-06-01 by the drafting team...`;
    expect(scrapeLastUpdated(html)).toBe("2023-06-01");
  });

  it("returns null when no date is present", () => {
    expect(scrapeLastUpdated("<html>no footer here</html>")).toBeNull();
  });
});
