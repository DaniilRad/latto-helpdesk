import { describe, expect, it } from "vitest";
import { can, DEFAULT_PROFILES, evaluateRole, PERMISSIONS } from "./rbac.js";

const rule = (over) => ({ id: "r", enabled: true, type: "group", value: "IT-Admins", role: "admin", ...over });

describe("evaluateRole (AD rule matrix)", () => {
  it("matches group membership", () => {
    const user = { groups: ["IT-Admins"] };
    expect(evaluateRole(user, [rule({ id: "g1" })])).toEqual({ role: "admin", ruleId: "g1" });
  });

  it("matches OU containment case-insensitively", () => {
    const user = { ou: "OU=Helpdesk,DC=corp" };
    const rules = [rule({ id: "o1", type: "ou", value: "helpdesk", role: "technician" })];
    expect(evaluateRole(user, rules)).toEqual({ role: "technician", ruleId: "o1" });
  });

  it("matches attribute=value", () => {
    const user = { employeeType: "External" };
    const rules = [rule({ id: "a1", type: "attribute", value: "employeeType=External", role: "external" })];
    expect(evaluateRole(user, rules)).toEqual({ role: "external", ruleId: "a1" });
  });

  it("skips disabled rules and applies the fallback", () => {
    const user = { groups: ["IT-Admins"] };
    expect(evaluateRole(user, [rule({ enabled: false })])).toEqual({ role: "end-user", ruleId: null });
  });

  it("returns the first matching enabled rule (order wins)", () => {
    const user = { groups: ["IT-Admins"] };
    const rules = [rule({ id: "first", role: "supervisor" }), rule({ id: "second", role: "admin" })];
    expect(evaluateRole(user, rules).ruleId).toBe("first");
  });

  it("honors a custom fallback when nothing matches", () => {
    expect(evaluateRole({ groups: [] }, [], "external")).toEqual({ role: "external", ruleId: null });
  });
});

describe("can (permission lookup)", () => {
  it("reads the profile matrix", () => {
    expect(can("admin", "settings.manage", DEFAULT_PROFILES)).toBe(true);
    expect(can("end-user", "tickets.all", DEFAULT_PROFILES)).toBe(false);
  });

  it("is false for unknown role, unknown perm, or missing profiles", () => {
    expect(can("admin", "does.not.exist", DEFAULT_PROFILES)).toBe(false);
    expect(can("ghost", "tickets.all", DEFAULT_PROFILES)).toBe(false);
    expect(can("admin", "tickets.all", undefined)).toBe(false);
  });
});

describe("DEFAULT_PROFILES sanity", () => {
  const permKeys = PERMISSIONS.map((p) => p.key);

  it("grants the admin every permission", () => {
    for (const key of permKeys) expect(DEFAULT_PROFILES.admin[key]).toBe(true);
  });

  it("grants the end-user no permissions", () => {
    for (const key of permKeys) expect(DEFAULT_PROFILES["end-user"][key]).toBe(false);
  });

  it("defines a value for every permission across every role", () => {
    for (const role of Object.keys(DEFAULT_PROFILES)) {
      for (const key of permKeys) expect(typeof DEFAULT_PROFILES[role][key]).toBe("boolean");
    }
  });
});
