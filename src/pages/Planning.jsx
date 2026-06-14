import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Card, Select, Badge } from "../ds";
import { PageHeader, Eyebrow, rowActivation } from "../components/bits.jsx";
import { OPEN_STATUSES, PRIORITY, slaState } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

const P_COLOR = { 1: "var(--danger)", 2: "var(--warning)", 3: "var(--accent)", 4: "var(--info)", 5: "var(--text-3)" };

/**
 * Technician planning calendar — month grid with open tickets placed on
 * their SLA resolution due date, plus asset reservations.
 */
export function Planning() {
  const { tickets, reservations, devices, users, slaConfig } = useStore();
  const nav = useNavigate();
  const [cursor, setCursor] = React.useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [tech, setTech] = React.useState("all");

  const technicians = users.filter((u) => u.groups?.some((g) => ["IT-Admins", "IT-Support", "IT-Supervisors"].includes(g)));

  const open = tickets
    .filter((t) => OPEN_STATUSES.includes(t.status))
    .filter((t) => tech === "all" || t.assigneeId === tech)
    .map((t) => ({ ...t, due: new Date(slaState(t, Date.now(), slaConfig).resolve.due) }));

  const monthLabel = cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const sameDay = (date, d) => date.getFullYear() === year && date.getMonth() === month && date.getDate() === d;
  const today = new Date();

  const resFor = (d) => reservations.filter((r) => {
    const day = new Date(year, month, d);
    return new Date(r.from) <= new Date(year, month, d, 23, 59) && new Date(r.to) >= day;
  });

  return (
    <>
      <PageHeader eyebrow="PLANNING" title="Planning"
        actions={
          <>
            <Select size="sm" value={tech} onChange={(e) => setTech(e.target.value)} style={{ width: 180 }}
              options={[{ value: "all", label: "All technicians" },
                ...technicians.map((u) => ({ value: u.id, label: u.displayName }))]} />
            <Button variant="ghost" size="sm" onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft size={15} /></Button>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-1)", minWidth: 130, textAlign: "center" }}>
              {monthLabel}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight size={15} /></Button>
          </>
        }>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-3)" }}>
          Open tickets land on their SLA resolution due date. Reservations show below them.
        </p>
      </PageHeader>

      <Card padding="0" style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
              <Eyebrow>{d}</Eyebrow>
            </div>
          ))}
          {cells.map((d, i) => {
            const dayTickets = d ? open.filter((t) => sameDay(t.due, d)) : [];
            const overdue = d ? open.filter((t) => t.due < new Date(year, month, d) && sameDay(t.due, d)) : [];
            const dayRes = d ? resFor(d) : [];
            const isToday = d && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
            return (
              <div key={i} style={{ minHeight: 96, padding: "8px 8px 10px",
                borderBottom: "1px solid var(--border-faint)",
                borderRight: (i + 1) % 7 === 0 ? "none" : "1px solid var(--border-faint)",
                background: isToday ? "var(--accent-soft)" : "transparent" }}>
                {d && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11,
                    color: isToday ? "var(--accent-text)" : "var(--text-3)", marginBottom: 6 }}>
                    {d}
                  </div>
                )}
                {dayTickets.slice(0, 3).map((t) => (
                  <div key={t.id} {...rowActivation(() => nav(`/tickets/${t.id}`))}
                    title={`${t.number} · ${t.title}`} aria-label={`Ticket ${t.number}: ${t.title}`}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "var(--space-1) var(--space-2)",
                      marginBottom: "var(--space-1)", background: "var(--surface-2)",
                      borderLeft: `2px solid ${P_COLOR[t.priority]}`,
                      borderRadius: "var(--radius-sm)", cursor: "pointer", overflow: "hidden" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface-2)"; }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", flex: "0 0 auto" }}>
                      {PRIORITY[t.priority].short}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-1)", flex: 1, minWidth: 0, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                  </div>
                ))}
                {dayTickets.length > 3 && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}>
                    +{dayTickets.length - 3} more
                  </span>
                )}
                {dayRes.map((r) => (
                  <div key={r.id} {...rowActivation(() => nav("/reservations"))} title={r.note}
                    aria-label={`Reservation: ${devices.find((x) => x.id === r.assetId)?.name || "asset"}`}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "var(--space-1) var(--space-2)",
                      marginTop: "var(--space-1)", borderRadius: "var(--radius-sm)", cursor: "pointer",
                      border: "1px dashed var(--border-strong)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-2)",
                      flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      ⌂ {devices.find((x) => x.id === r.assetId)?.name || "?"}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
