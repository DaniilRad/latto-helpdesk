// RBAC — system profiles, permissions, and the AD→role rule evaluator.

export const ROLES = {
  admin:      { label: "Administrator", color: "var(--accent)" },
  supervisor: { label: "Supervisor",    color: "var(--warning)" },
  technician: { label: "Technician",    color: "var(--info)" },
  "end-user": { label: "End-user",      color: "var(--success)" },
  external:   { label: "External",      color: "var(--text-3)" },
};

export const PERMISSIONS = [
  { key: "tickets.all",     label: "See all tickets (queue)" },
  { key: "tickets.assign",  label: "Assign tickets" },
  { key: "tickets.edit",    label: "Work tickets (status, notes)" },
  { key: "devices.read",    label: "View assets / CMDB" },
  { key: "devices.write",   label: "Edit assets" },
  { key: "users.read",      label: "View AD users" },
  { key: "users.write",     label: "Edit AD users" },
  { key: "kb.internal",     label: "Read internal KB" },
  { key: "kb.write",        label: "Write KB articles" },
  { key: "rules.manage",    label: "Manage roles & AD rules" },
  { key: "settings.manage", label: "Manage settings" },
];

/** Default permission sets per profile (editable in the Roles page). */
export const DEFAULT_PROFILES = {
  admin: {
    "tickets.all": true, "tickets.assign": true, "tickets.edit": true,
    "devices.read": true, "devices.write": true, "users.read": true, "users.write": true,
    "kb.internal": true, "kb.write": true, "rules.manage": true, "settings.manage": true,
  },
  supervisor: {
    "tickets.all": true, "tickets.assign": true, "tickets.edit": true,
    "devices.read": true, "devices.write": false, "users.read": true, "users.write": false,
    "kb.internal": true, "kb.write": true, "rules.manage": false, "settings.manage": false,
  },
  technician: {
    "tickets.all": true, "tickets.assign": false, "tickets.edit": true,
    "devices.read": true, "devices.write": true, "users.read": true, "users.write": false,
    "kb.internal": true, "kb.write": true, "rules.manage": false, "settings.manage": false,
  },
  "end-user": {
    "tickets.all": false, "tickets.assign": false, "tickets.edit": false,
    "devices.read": false, "devices.write": false, "users.read": false, "users.write": false,
    "kb.internal": false, "kb.write": false, "rules.manage": false, "settings.manage": false,
  },
  external: {
    "tickets.all": false, "tickets.assign": false, "tickets.edit": false,
    "devices.read": false, "devices.write": false, "users.read": false, "users.write": false,
    "kb.internal": false, "kb.write": false, "rules.manage": false, "settings.manage": false,
  },
};

export const RULE_TYPES = {
  group:     { label: "AD group membership", hint: "Matches when the user is in this group" },
  ou:        { label: "OU contains",         hint: "Matches when the user's OU contains this text" },
  attribute: { label: "Attribute equals",    hint: "Matches attribute=value, e.g. employeeType=External" },
};

/**
 * Evaluate the rule matrix for one user. Rules run in order; the first
 * enabled match wins (GLPI-style). Returns { role, ruleId } — ruleId null
 * means the fallback applied.
 */
export function evaluateRole(user, rules, fallback = "end-user") {
  for (const r of rules) {
    if (!r.enabled) continue;
    if (r.type === "group" && (user.groups || []).includes(r.value)) return { role: r.role, ruleId: r.id };
    if (r.type === "ou" && (user.ou || "").toLowerCase().includes(r.value.toLowerCase())) return { role: r.role, ruleId: r.id };
    if (r.type === "attribute") {
      const [field, val] = r.value.split("=").map((s) => s.trim());
      if (field && String(user[field] ?? "") === val) return { role: r.role, ruleId: r.id };
    }
  }
  return { role: fallback, ruleId: null };
}

/** Permission check against the (possibly edited) profile matrix. */
export const can = (role, perm, profiles) => Boolean(profiles?.[role]?.[perm]);
