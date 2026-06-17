import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  computePriority,
  daysUntil,
  dueIn,
  formatDate,
  lastMonths,
  monthKey,
  rangesOverlap,
  relTime,
  slaState,
} from "./meta.js";

const HOUR = 3_600_000;
const DAY = 86_400_000;

describe("computePriority (impact × urgency matrix)", () => {
  it("maps the corners of the matrix", () => {
    expect(computePriority("high", "high")).toBe(1);
    expect(computePriority("low", "low")).toBe(5);
  });

  it("treats impact/urgency symmetrically where the matrix does", () => {
    expect(computePriority("high", "medium")).toBe(2);
    expect(computePriority("medium", "high")).toBe(2);
    expect(computePriority("medium", "medium")).toBe(3);
  });

  it("defaults to P3 for unknown combinations", () => {
    expect(computePriority("bogus", "nope")).toBe(3);
    expect(computePriority(undefined, undefined)).toBe(3);
  });
});

describe("slaState", () => {
  const created = "2026-01-01T00:00:00.000Z";
  const createdMs = Date.parse(created);
  // P3 config: respond 4h, resolve 24h; warn fraction 0.8 → respond warns at 3.2h.
  const ticket = (over) => ({ priority: 3, createdAt: created, ...over });

  it("is ok well within the window", () => {
    const s = slaState(ticket(), createdMs + 1 * HOUR);
    expect(s.respond.state).toBe("ok");
    expect(s.resolve.state).toBe("ok");
  });

  it("flips to risk past the warn fraction", () => {
    const s = slaState(ticket(), createdMs + 3.5 * HOUR);
    expect(s.respond.state).toBe("risk"); // 3.5h > 3.2h warn, < 4h due
    expect(s.resolve.state).toBe("ok"); // still far from the 24h resolve target
  });

  it("breaches once the due time passes", () => {
    const s = slaState(ticket(), createdMs + 5 * HOUR);
    expect(s.respond.state).toBe("breached");
  });

  it("is met when satisfied before the due time", () => {
    const s = slaState(
      ticket({ firstResponseAt: new Date(createdMs + 2 * HOUR).toISOString() }),
      createdMs + 10 * HOUR,
    );
    expect(s.respond.state).toBe("met");
  });

  it("is late when satisfied after the due time", () => {
    const s = slaState(
      ticket({ firstResponseAt: new Date(createdMs + 6 * HOUR).toISOString() }),
      createdMs + 10 * HOUR,
    );
    expect(s.respond.state).toBe("late");
  });

  it("treats a closed ticket's updatedAt as the resolve-satisfied time", () => {
    const s = slaState(
      ticket({ status: "closed", updatedAt: new Date(createdMs + 3 * HOUR).toISOString() }),
      createdMs + 100 * HOUR,
    );
    expect(s.resolve.state).toBe("met"); // closed at 3h, well under the 24h target
  });

  it("falls back to the P3 window for an unknown priority", () => {
    const s = slaState(ticket({ priority: 99 }), createdMs + 5 * HOUR);
    expect(s.respond.state).toBe("breached"); // uses P3's 4h respond
  });
});

describe("time helpers (deterministic clock)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T12:00:00.000Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("relTime buckets by minute/hour/day", () => {
    expect(relTime(null)).toBe("—");
    expect(relTime(new Date(Date.now() - 30_000).toISOString())).toBe("now");
    expect(relTime(new Date(Date.now() - 5 * 60_000).toISOString())).toBe("5m ago");
    expect(relTime(new Date(Date.now() - 2 * HOUR).toISOString())).toBe("2h ago");
    expect(relTime(new Date(Date.now() - 3 * DAY).toISOString())).toBe("3d ago");
  });

  it("dueIn formats upcoming and overdue spans", () => {
    expect(dueIn(Date.now() + 2 * HOUR + 10 * 60_000)).toBe("in 2h 10m");
    expect(dueIn(Date.now() - 1 * HOUR)).toBe("1h 0m over");
    expect(dueIn(Date.now() + 3 * DAY)).toBe("in 3d");
  });

  it("daysUntil rounds up and handles null", () => {
    expect(daysUntil(null)).toBeNull();
    expect(daysUntil(new Date(Date.now() + 3 * DAY).toISOString())).toBe(3);
    expect(daysUntil(new Date(Date.now() - 1 * DAY).toISOString())).toBeLessThan(0);
  });
});

describe("date + range utilities", () => {
  it("formatDate renders en-GB and guards bad input", () => {
    expect(formatDate("2026-06-17")).toBe("17 Jun 2026");
    expect(formatDate(null)).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });

  it("monthKey slices the YYYY-MM prefix", () => {
    expect(monthKey("2026-06-17T08:30:00Z")).toBe("2026-06");
    expect(monthKey(null)).toBeNull();
  });

  it("lastMonths returns n ascending month buckets ending on `now`", () => {
    const months = lastMonths(3, new Date("2026-03-15T00:00:00"));
    expect(months).toHaveLength(3);
    expect(months.map((m) => m.key)).toEqual(["2026-01", "2026-02", "2026-03"]);
  });

  it("rangesOverlap is true on overlap, false when disjoint or merely touching", () => {
    expect(rangesOverlap("2026-01-01", "2026-01-10", "2026-01-05", "2026-01-15")).toBe(true);
    expect(rangesOverlap("2026-01-01", "2026-01-05", "2026-01-10", "2026-01-15")).toBe(false);
    expect(rangesOverlap("2026-01-01", "2026-01-05", "2026-01-05", "2026-01-10")).toBe(false);
  });
});
