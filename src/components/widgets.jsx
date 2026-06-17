import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Card, Select } from "../ds";
import {
  CONTRACT_TYPES,
  DEVICE_TYPES,
  daysUntil,
  formatDate,
  lastMonths,
  monthKey,
  OPEN_STATUSES,
  relTime,
  slaState,
  TICKET_STATUS,
} from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";
import { Eyebrow, StatCard } from "./bits.jsx";
import { BarChart, Donut, MonthlyBars } from "./charts.jsx";
import { PriorityBadge, SlaBadge } from "./ticketBits.jsx";

const TICKET_COLORS = {
  new: "var(--info)",
  assigned: "var(--accent)",
  "in-progress": "var(--accent)",
  waiting: "var(--warning)",
  resolved: "var(--success)",
  closed: "var(--text-3)",
};

const listRow = (onClick) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 18px",
  cursor: onClick ? "pointer" : "default",
  borderTop: "1px solid var(--border-faint)",
});

/* Keyboard-accessible navigation row. A real <button> (native Enter/Space and
   focus), reset to look like a row, using the shared `.latto-rowhover` class so
   hover and keyboard focus light up identically. */
function NavRow({ onClick, style, children }) {
  return (
    <button
      type="button"
      className="latto-rowhover"
      onClick={onClick}
      style={{
        border: "none",
        background: "transparent",
        width: "100%",
        font: "inherit",
        color: "inherit",
        textAlign: "left",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function ListCard({ title, action, empty, children }) {
  return (
    <Card padding="0" style={{ height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px 8px" }}>
        <Eyebrow>{title}</Eyebrow>
        {action}
      </div>
      {React.Children.count(children) === 0 ? (
        <p style={{ padding: "0 18px 16px", margin: 0, color: "var(--text-3)", fontSize: 13 }}>{empty}</p>
      ) : (
        children
      )}
    </Card>
  );
}

/* ---------- KPI widgets ---------- */

function KpiTickets() {
  const { tickets, persona } = useStore();
  const open = tickets.filter((t) => OPEN_STATUSES.includes(t.status));
  const mine = open.filter((t) => t.assigneeId === persona.id);
  return <StatCard label="Open tickets" value={open.length} sub={`${mine.length} mine`} />;
}
function KpiSla() {
  const { tickets, slaConfig } = useStore();
  const atRisk = tickets
    .filter((t) => OPEN_STATUSES.includes(t.status))
    .filter((t) => {
      const s = slaState(t, Date.now(), slaConfig);
      return ["risk", "breached"].includes(s.respond.state) || ["risk", "breached"].includes(s.resolve.state);
    });
  return (
    <StatCard
      label="SLA at risk"
      value={atRisk.length}
      sub={atRisk.length ? "act now" : "all green"}
      tone={atRisk.length ? "danger" : "success"}
    />
  );
}
function KpiRepair() {
  const { devices } = useStore();
  return (
    <StatCard
      label="Devices in repair"
      value={devices.filter((d) => d.status === "repair").length}
      sub={`${devices.length} total`}
      tone="warning"
    />
  );
}
function KpiUsers() {
  const { users } = useStore();
  const locked = users.filter((u) => u.status === "locked").length;
  return (
    <StatCard label="AD users" value={users.length} sub={`${locked} locked`} tone={locked ? "danger" : undefined} />
  );
}

/* ---------- chart widgets ---------- */

function MonthlyFlow() {
  const { tickets } = useStore();
  const [period, setPeriod] = React.useState(6);
  const months = lastMonths(period);
  const created = months.map((m) => tickets.filter((t) => monthKey(t.createdAt) === m.key).length);
  const resolved = months.map((m) => tickets.filter((t) => monthKey(t.resolvedAt) === m.key).length);
  return (
    <Card style={{ height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Eyebrow>TICKET FLOW · MONTHLY</Eyebrow>
        <Select
          size="sm"
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          style={{ width: 120 }}
          options={[
            { value: 3, label: "3 months" },
            { value: 6, label: "6 months" },
            { value: 12, label: "12 months" },
          ]}
        />
      </div>
      <MonthlyBars
        months={months}
        series={[
          { label: "New", color: "var(--accent)", values: created },
          { label: "Resolved", color: "var(--success)", values: resolved },
        ]}
      />
    </Card>
  );
}

function TicketsStatus() {
  const { tickets } = useStore();
  const segments = Object.entries(TICKET_STATUS)
    .map(([k, s]) => ({ label: s.label, value: tickets.filter((t) => t.status === k).length, color: TICKET_COLORS[k] }))
    .filter((s) => s.value > 0);
  return (
    <Card style={{ height: "100%" }}>
      <Eyebrow style={{ marginBottom: 14 }}>TICKETS BY STATUS</Eyebrow>
      <Donut segments={segments} centerLabel="tickets" size={128} stroke={14} />
    </Card>
  );
}

function DevicesType() {
  const { devices } = useStore();
  const data = Object.entries(DEVICE_TYPES)
    .map(([k, t]) => ({ label: t.label, value: devices.filter((d) => d.type === k).length, color: "var(--accent)" }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);
  return (
    <Card style={{ height: "100%" }}>
      <Eyebrow style={{ marginBottom: 14 }}>DEVICES BY TYPE</Eyebrow>
      <BarChart data={data} />
    </Card>
  );
}

/* ---------- list widgets ---------- */

function SlaWatchlist() {
  const { tickets, slaConfig } = useStore();
  const nav = useNavigate();
  const atRisk = tickets
    .filter((t) => OPEN_STATUSES.includes(t.status))
    .filter((t) => {
      const s = slaState(t, Date.now(), slaConfig);
      return ["risk", "breached"].includes(s.respond.state) || ["risk", "breached"].includes(s.resolve.state);
    })
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 6);
  return (
    <ListCard title="SLA WATCHLIST" empty="Nothing at risk. Enjoy it while it lasts.">
      {atRisk.map((t) => (
        <NavRow key={t.id} style={listRow(true)} onClick={() => nav(`/tickets/${t.id}`)}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-text)", width: 66 }}>
            {t.number}
          </span>
          <PriorityBadge priority={t.priority} />
          <span
            style={{
              fontSize: 13,
              color: "var(--text-1)",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {t.title}
          </span>
          <SlaBadge ticket={t} />
        </NavRow>
      ))}
    </ListCard>
  );
}

function Warranty() {
  const { devices } = useStore();
  const nav = useNavigate();
  const rows = devices
    .map((d) => ({ ...d, days: daysUntil(d.warrantyUntil) }))
    .filter((d) => d.days != null && d.days >= -14 && d.days <= 90 && d.status !== "retired")
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);
  return (
    <ListCard title="WARRANTY · 90 DAYS" empty="Nothing expiring soon.">
      {rows.map((d) => (
        <NavRow key={d.id} style={listRow(true)} onClick={() => nav(`/devices/${d.id}`)}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-1)", flex: 1 }}>
            {d.name}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
            {formatDate(d.warrantyUntil)}
          </span>
          <Badge tone={d.days <= 30 ? "warning" : "neutral"}>{d.days < 0 ? "expired" : `${d.days}d`}</Badge>
        </NavRow>
      ))}
    </ListCard>
  );
}

function ContractsWidget() {
  const { contracts } = useStore();
  const nav = useNavigate();
  const rows = contracts
    .map((c) => ({ ...c, days: daysUntil(c.endDate) }))
    .filter((c) => c.days != null && c.days <= 120)
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);
  return (
    <ListCard title="CONTRACTS & CERTS · EXPIRING" empty="No contracts or certificates ending soon.">
      {rows.map((c) => (
        <NavRow key={c.id} style={listRow(true)} onClick={() => nav("/contracts")}>
          <Badge tone={CONTRACT_TYPES[c.type]?.tone || "info"}>{c.type === "certificate" ? "cert" : "contract"}</Badge>
          <span
            style={{
              fontSize: 13,
              color: "var(--text-1)",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {c.name}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
            {formatDate(c.endDate)}
          </span>
          <Badge tone={c.days < 0 ? "danger" : c.days <= 30 ? "warning" : "neutral"}>
            {c.days < 0 ? "expired" : `${c.days}d`}
          </Badge>
        </NavRow>
      ))}
    </ListCard>
  );
}

function LockedAccounts() {
  const { users } = useStore();
  const nav = useNavigate();
  const locked = users.filter((u) => u.status === "locked");
  return (
    <ListCard title="LOCKED ACCOUNTS" empty="No locked accounts.">
      {locked.map((u) => (
        <NavRow key={u.id} style={listRow(true)} onClick={() => nav(`/users/${u.id}`)}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--danger)" }}>{u.sam}</span>
          <span style={{ fontSize: 13, color: "var(--text-2)", flex: 1 }}>{u.displayName}</span>
          <Badge tone="danger" dot>
            locked
          </Badge>
        </NavRow>
      ))}
    </ListCard>
  );
}

function Activity() {
  const { activity } = useStore();
  return (
    <Card padding="0" style={{ height: "100%" }}>
      <div style={{ padding: "14px 18px 6px" }}>
        <Eyebrow>RECENT ACTIVITY</Eyebrow>
      </div>
      <div style={{ padding: "0 18px 12px", display: "flex", flexDirection: "column" }}>
        {activity.slice(0, 7).map((a) => (
          <div key={a.id} style={{ display: "flex", gap: 10, padding: "6px 0", alignItems: "baseline" }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                flex: "0 0 auto",
                marginTop: 5,
                background:
                  a.tone === "danger"
                    ? "var(--danger)"
                    : a.tone === "warning"
                      ? "var(--warning)"
                      : a.tone === "success"
                        ? "var(--success)"
                        : "var(--text-3)",
              }}
            />
            <span style={{ fontSize: 12.5, color: "var(--text-2)", flex: 1, lineHeight: 1.45 }}>{a.text}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", flex: "0 0 auto" }}>
              {relTime(a.ts)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function LowStock() {
  const { consumables } = useStore();
  const nav = useNavigate();
  const low = consumables.filter((c) => c.stock < c.min);
  return (
    <ListCard title="LOW STOCK" empty="Stock levels are fine.">
      {low.map((c) => (
        <NavRow key={c.id} style={listRow(true)} onClick={() => nav("/consumables")}>
          <span
            style={{
              fontSize: 13,
              color: "var(--text-1)",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {c.name}
          </span>
          <Badge tone="danger">
            {c.stock}/{c.min}
          </Badge>
        </NavRow>
      ))}
    </ListCard>
  );
}

function UpcomingReservations() {
  const { reservations, devices, users } = useStore();
  const nav = useNavigate();
  const rows = reservations
    .filter((r) => new Date(r.to) > new Date())
    .sort((a, b) => new Date(a.from) - new Date(b.from))
    .slice(0, 5);
  return (
    <ListCard title="RESERVATIONS" empty="Nothing reserved.">
      {rows.map((r) => (
        <NavRow key={r.id} style={listRow(true)} onClick={() => nav("/reservations")}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-1)" }}>
            {devices.find((d) => d.id === r.assetId)?.name || "?"}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {users.find((u) => u.id === r.userId)?.displayName || "?"}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
            {formatDate(r.from)}
          </span>
        </NavRow>
      ))}
    </ListCard>
  );
}

/** Widget registry: key → { title, sizes (allowed col spans of 4), default, component }. */
export const WIDGETS = {
  "kpi-tickets": { title: "KPI · Open tickets", sizes: [1, 2], component: KpiTickets },
  "kpi-sla": { title: "KPI · SLA at risk", sizes: [1, 2], component: KpiSla },
  "kpi-repair": { title: "KPI · In repair", sizes: [1, 2], component: KpiRepair },
  "kpi-users": { title: "KPI · AD users", sizes: [1, 2], component: KpiUsers },
  "monthly-flow": { title: "Ticket flow (monthly)", sizes: [2, 3, 4], component: MonthlyFlow },
  "tickets-status": { title: "Tickets by status", sizes: [2, 3], component: TicketsStatus },
  "devices-type": { title: "Devices by type", sizes: [1, 2], component: DevicesType },
  "sla-watchlist": { title: "SLA watchlist", sizes: [2, 3, 4], component: SlaWatchlist },
  warranty: { title: "Warranty watchlist", sizes: [1, 2], component: Warranty },
  contracts: { title: "Contracts & certs", sizes: [1, 2], component: ContractsWidget },
  locked: { title: "Locked accounts", sizes: [1, 2], component: LockedAccounts },
  activity: { title: "Recent activity", sizes: [1, 2], component: Activity },
  "low-stock": { title: "Low stock consumables", sizes: [1, 2], component: LowStock },
  reservations: { title: "Upcoming reservations", sizes: [1, 2], component: UpcomingReservations },
};
