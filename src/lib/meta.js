// Domain metadata — device types, statuses, ticketing, SLA, helpers.
import {
  Container,
  Keyboard,
  Laptop,
  Monitor,
  Network,
  PlugZap,
  Printer,
  ScanLine,
  Server,
  Smartphone,
  Tv,
} from "lucide-react";

export const DEVICE_TYPES = {
  pc: { label: "PC", icon: Monitor, color: "var(--accent)" },
  notebook: { label: "Notebook", icon: Laptop, color: "var(--info)" },
  mobile: { label: "Mobile", icon: Smartphone, color: "var(--success)" },
  server: { label: "Server", icon: Server, color: "var(--danger)" },
  printer: { label: "Printer", icon: Printer, color: "var(--violet, #a78bfa)" },
  scanner: { label: "Scanner", icon: ScanLine, color: "var(--warning)" },
  monitor: { label: "Monitor", icon: Tv, color: "var(--text-2)" },
  network: { label: "Network", icon: Network, color: "var(--danger)" },
  rack: { label: "Rack", icon: Container, color: "var(--text-2)" },
  pdu: { label: "PDU", icon: PlugZap, color: "var(--warning)" },
  peripheral: { label: "Peripheral", icon: Keyboard, color: "var(--text-3)" },
};

export const CONSUMABLE_TYPES = {
  toner: { label: "Toner" },
  cable: { label: "Cable" },
  sim: { label: "SIM card" },
  other: { label: "Other" },
};

export const CONTRACT_TYPES = {
  contract: { label: "Contract", tone: "info" },
  certificate: { label: "Certificate", tone: "accent" },
};

export const DEVICE_STATUS = {
  "in-use": { label: "In use", tone: "success" },
  "in-stock": { label: "In stock", tone: "info" },
  repair: { label: "Repair", tone: "warning" },
  retired: { label: "Retired", tone: "neutral" },
};

export const USER_STATUS = {
  enabled: { label: "Enabled", tone: "success" },
  disabled: { label: "Disabled", tone: "neutral" },
  locked: { label: "Locked", tone: "danger" },
};

/* ============ Ticketing ============ */

export const TICKET_STATUS = {
  new: { label: "New", tone: "info" },
  assigned: { label: "Assigned", tone: "accent" },
  "in-progress": { label: "In progress", tone: "accent" },
  waiting: { label: "Waiting", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  closed: { label: "Closed", tone: "neutral" },
};
export const OPEN_STATUSES = ["new", "assigned", "in-progress", "waiting"];

export const PROBLEM_STATUS = {
  open: { label: "Open", tone: "info" },
  investigating: { label: "Investigating", tone: "accent" },
  "known-error": { label: "Known error", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  closed: { label: "Closed", tone: "neutral" },
};
export const PROBLEM_OPEN_STATUSES = ["open", "investigating", "known-error"];

export const TICKET_CATEGORIES = {
  incident: { label: "Incident" },
  request: { label: "Service request" },
  question: { label: "Question" },
  change: { label: "Change" },
};

export const LEVELS = {
  low: { label: "Low" },
  medium: { label: "Medium" },
  high: { label: "High" },
};

/** GLPI-style priority matrix: impact × urgency → P1..P5. */
const MATRIX = {
  "high:high": 1,
  "high:medium": 2,
  "medium:high": 2,
  "high:low": 3,
  "medium:medium": 3,
  "low:high": 3,
  "medium:low": 4,
  "low:medium": 4,
  "low:low": 5,
};
export const computePriority = (impact, urgency) => MATRIX[`${impact}:${urgency}`] ?? 3;

export const PRIORITY = {
  1: { label: "P1 · Critical", short: "P1", tone: "danger" },
  2: { label: "P2 · High", short: "P2", tone: "warning" },
  3: { label: "P3 · Medium", short: "P3", tone: "accent" },
  4: { label: "P4 · Low", short: "P4", tone: "info" },
  5: { label: "P5 · Planning", short: "P5", tone: "neutral" },
};

/** SLA targets per priority, in hours: time to respond / time to resolve. */
export const SLA_CONFIG = {
  1: { respond: 0.5, resolve: 4 },
  2: { respond: 1, resolve: 8 },
  3: { respond: 4, resolve: 24 },
  4: { respond: 8, resolve: 72 },
  5: { respond: 24, resolve: 120 },
};
export const SLA_WARN_FRACTION = 0.8;

/**
 * Compute SLA state for one ticket.
 * Returns { respond: {due, state}, resolve: {due, state} } where state is
 * met | late | ok | risk | breached (met/late once satisfied, else vs now).
 */
export function slaState(ticket, now = Date.now(), config = SLA_CONFIG) {
  const cfg = config[ticket.priority] || config[3] || SLA_CONFIG[3];
  const created = new Date(ticket.createdAt).getTime();
  const respondDue = created + cfg.respond * 3600000;
  const resolveDue = created + cfg.resolve * 3600000;

  const phase = (satisfiedAt, due, total) => {
    if (satisfiedAt) return { due, state: new Date(satisfiedAt).getTime() <= due ? "met" : "late" };
    if (now > due) return { due, state: "breached" };
    if (now > created + total * SLA_WARN_FRACTION) return { due, state: "risk" };
    return { due, state: "ok" };
  };

  const done = ticket.resolvedAt || (ticket.status === "closed" ? ticket.updatedAt : null);
  return {
    respond: phase(ticket.firstResponseAt, respondDue, cfg.respond * 3600000),
    resolve: phase(done, resolveDue, cfg.resolve * 3600000),
  };
}

export const SLA_TONES = { met: "success", ok: "success", risk: "warning", late: "danger", breached: "danger" };

/* ============ Helpers ============ */

export const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10)).slice(0, 8);

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function relTime(iso) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

/** "in 2h 10m" / "3h overdue" style countdown vs a due timestamp. */
export function dueIn(due, now = Date.now()) {
  const diff = due - now;
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  const span = h >= 48 ? `${Math.floor(h / 24)}d` : h > 0 ? `${h}h ${m}m` : `${m}m`;
  return diff >= 0 ? `in ${span}` : `${span} over`;
}

export function daysUntil(iso) {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

/** "2026-06" key + short label for monthly charts. */
export function lastMonths(n, now = new Date()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-GB", { month: "short" }),
    });
  }
  return out;
}
export const monthKey = (iso) => (iso ? String(iso).slice(0, 7) : null);

/** Do two [from,to] ranges overlap? ISO strings. */
export const rangesOverlap = (aFrom, aTo, bFrom, bTo) =>
  new Date(aFrom) < new Date(bTo) && new Date(bFrom) < new Date(aTo);
