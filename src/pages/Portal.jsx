import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, LifeBuoy, BookOpen, ArrowRight } from "lucide-react";
import { Card, Button, Input, Badge } from "../ds";
import { Eyebrow, rowActivation } from "../components/bits.jsx";
import { PriorityBadge, StatusBadge } from "../components/ticketBits.jsx";
import { TicketDialog } from "../components/TicketDialog.jsx";
import { OPEN_STATUSES, relTime } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

/** Self-service home for end-users and externals. */
export function Portal() {
  const { tickets, kb, persona, hasPerm } = useStore();
  const nav = useNavigate();
  const [creating, setCreating] = React.useState(false);
  const [q, setQ] = React.useState("");

  const mine = tickets.filter((t) => t.requesterId === persona.id);
  const open = mine.filter((t) => OPEN_STATUSES.includes(t.status));
  const awaitingApproval = mine.filter((t) => t.status === "resolved");

  const publicKb = kb.filter((a) => a.visibility === "public" || hasPerm("kb.internal"));
  const needle = q.trim().toLowerCase();
  const hits = needle
    ? publicKb.filter((a) => [a.title, a.body, (a.tags || []).join(" ")].join(" ").toLowerCase().includes(needle)).slice(0, 5)
    : publicKb.slice(0, 4);

  return (
    <>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "26px 0 22px" }}>
          <Eyebrow style={{ marginBottom: 8 }}>HELPDESK · SELF-SERVICE</Eyebrow>
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: "var(--text-1)" }}>
            Hi {persona.displayName.split(" ")[0]}, what's broken?
          </h2>
          <p style={{ margin: "10px 0 18px", fontSize: 14, color: "var(--text-3)" }}>
            Search the knowledge base first — or just open a ticket.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
            <Input placeholder="Search help articles…" aria-label="Search help articles" icon={<Search size={16} />} size="lg"
              value={q} onChange={(e) => setQ(e.target.value)} wrapStyle={{ width: 380 }} />
            <Button size="lg" iconLeft={<Plus size={17} />} onClick={() => setCreating(true)}>New ticket</Button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, alignItems: "start" }}>
          <Card padding="0">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 10px" }}>
              <Eyebrow><LifeBuoy size={11} style={{ verticalAlign: "-1px", marginRight: 6 }} />MY TICKETS · {open.length} OPEN</Eyebrow>
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => nav("/tickets")}>All</Button>
            </div>
            {mine.length === 0 ? (
              <p style={{ padding: "0 18px 18px", margin: 0, color: "var(--text-3)", fontSize: 13 }}>
                Nothing yet. When you open a ticket it shows up here.
              </p>
            ) : mine.slice(0, 5).map((t, i) => (
              <div key={t.id} {...rowActivation(() => nav(`/tickets/${t.id}`))}
                aria-label={`Ticket ${t.number}: ${t.title}`} className="latto-rowhover"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", cursor: "pointer",
                  borderTop: i === 0 ? "none" : "1px solid var(--border-faint)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-text)", flex: "0 0 auto" }}>{t.number}</span>
                <span style={{ fontSize: 13, color: "var(--text-1)", flex: 1, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                <StatusBadge status={t.status} />
              </div>
            ))}
            {awaitingApproval.length > 0 && (
              <div style={{ padding: "10px 18px 14px", borderTop: "1px solid var(--border)" }}>
                <Badge tone="success" dot>{awaitingApproval.length} resolved — please confirm</Badge>
              </div>
            )}
          </Card>

          <Card padding="0">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 10px" }}>
              <Eyebrow><BookOpen size={11} style={{ verticalAlign: "-1px", marginRight: 6 }} />
                {needle ? "SEARCH RESULTS" : "POPULAR ARTICLES"}</Eyebrow>
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => nav("/kb")}>Browse</Button>
            </div>
            {hits.length === 0 ? (
              <p style={{ padding: "0 18px 18px", margin: 0, color: "var(--text-3)", fontSize: 13 }}>
                No matches. Open a ticket and we'll figure it out together.
              </p>
            ) : hits.map((a, i) => (
              <div key={a.id} {...rowActivation(() => nav(`/kb/${a.id}`))}
                aria-label={`Article: ${a.title}`} className="latto-rowhover"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", cursor: "pointer",
                  borderTop: i === 0 ? "none" : "1px solid var(--border-faint)" }}>
                <span style={{ fontSize: 13, color: "var(--text-1)", flex: 1, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", flex: "0 0 auto" }}>
                  {a.category}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <TicketDialog open={creating} onClose={() => setCreating(false)} onCreated={(id) => nav(`/tickets/${id}`)} />
    </>
  );
}
