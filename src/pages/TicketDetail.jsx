import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Lock, MessageSquare, Send, Boxes } from "lucide-react";
import { Card, Badge, Button, Select, Avatar, Switch } from "../ds";
import { PageHeader, Eyebrow } from "../components/bits.jsx";
import { PriorityBadge, StatusBadge, Textarea } from "../components/ticketBits.jsx";
import {
  TICKET_STATUS, TICKET_CATEGORIES, LEVELS, DEVICE_TYPES, PROBLEM_STATUS,
  slaState, SLA_TONES, dueIn, formatDateTime, relTime,
} from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

function SlaRow({ label, phase, satisfiedAt }) {
  const toneColor = { success: "var(--success)", warning: "var(--warning)", danger: "var(--danger)" };
  const tone = SLA_TONES[phase.state];
  const text = phase.state === "met" ? `met · ${formatDateTime(satisfiedAt)}`
    : phase.state === "late" ? `late · ${formatDateTime(satisfiedAt)}`
    : phase.state === "breached" ? `${dueIn(phase.due)} · breached`
    : `due ${dueIn(phase.due)}`;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
      borderBottom: "1px solid var(--border-faint)" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em",
        textTransform: "uppercase", color: "var(--text-3)", width: 130, flex: "0 0 auto" }}>{label}</span>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: toneColor[tone] || "var(--text-3)", flex: "0 0 auto" }} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-2)" }}>{text}</span>
    </div>
  );
}

function TimelineEvent({ ev, users }) {
  const author = users.find((u) => u.id === ev.authorId);
  if (ev.type === "status") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0 6px 46px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
          {author?.sam || "system"} · {TICKET_STATUS[ev.from]?.label || ev.from} → {TICKET_STATUS[ev.to]?.label || ev.to} · {relTime(ev.ts)}
        </span>
      </div>
    );
  }
  if (ev.type === "system") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0 6px 46px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
          {ev.text} · {relTime(ev.ts)}
        </span>
      </div>
    );
  }
  const internal = ev.type === "note";
  return (
    <div style={{ display: "flex", gap: 12, padding: "10px 0" }}>
      <Avatar name={author?.displayName || "?"} size={34} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)" }}>{author?.displayName || "Unknown"}</span>
          {internal && <Badge tone="warning" style={{ height: "1.2rem" }}><Lock size={9} style={{ marginRight: 3 }} />internal</Badge>}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{relTime(ev.ts)}</span>
        </div>
        <div style={{
          padding: "10px 14px", fontSize: 14, lineHeight: 1.55, color: "var(--text-2)",
          background: internal ? "var(--warning-soft)" : "var(--surface-2)",
          border: `1px solid ${internal ? "color-mix(in srgb, var(--warning) 25%, transparent)" : "var(--border-faint)"}`,
          borderRadius: "var(--radius-md)",
        }}>
          {ev.text}
        </div>
      </div>
    </div>
  );
}

export function TicketDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const {
    tickets, users, devices, problems, groups, persona, hasPerm,
    setTicketStatus, assignTicket, setTicketGroup, saveTicketMeta, addTicketEvent,
  } = useStore();

  const [draft, setDraft] = React.useState("");
  const [internal, setInternal] = React.useState(false);

  const ticket = tickets.find((t) => t.id === id);
  const canWork = hasPerm("tickets.edit");
  const canSee = canWork || ticket?.requesterId === persona.id;

  if (!ticket || !canSee) {
    return (
      <>
        <Button variant="ghost" size="sm" iconLeft={<ArrowLeft size={15} />} onClick={() => nav("/tickets")}>Tickets</Button>
        <p style={{ color: "var(--text-2)" }}>{ticket ? "You don't have access to this ticket." : "This ticket doesn't exist anymore."}</p>
      </>
    );
  }

  const requester = users.find((u) => u.id === ticket.requesterId);
  const assignee = users.find((u) => u.id === ticket.assigneeId);
  const asset = devices.find((d) => d.id === ticket.assetId);
  const problem = problems.find((p) => p.id === ticket.problemId);
  const sla = slaState(ticket);
  const technicians = users.filter((u) => u.groups?.some((g) => ["IT-Admins", "IT-Support", "IT-Supervisors"].includes(g)));
  const timeline = canWork ? ticket.timeline : ticket.timeline.filter((e) => e.type !== "note");

  const send = () => {
    if (!draft.trim()) return;
    addTicketEvent(ticket.id, internal ? "note" : "comment", draft.trim(), persona.id);
    setDraft("");
  };

  // End-users can approve resolution (resolved → closed) per the spec.
  const canClose = !canWork && ticket.requesterId === persona.id && ticket.status === "resolved";

  return (
    <>
      <Button variant="ghost" size="sm" iconLeft={<ArrowLeft size={15} />}
        onClick={() => nav("/tickets")} style={{ marginBottom: 10 }}>Tickets</Button>

      <PageHeader eyebrow={`${ticket.number} · ${TICKET_CATEGORIES[ticket.category]?.label.toUpperCase() || ""}`}
        title={ticket.title}
        actions={canWork ? (
          <Select value={ticket.status} onChange={(e) => setTicketStatus(ticket.id, e.target.value, persona.id)}
            options={Object.entries(TICKET_STATUS).map(([v, s]) => ({ value: v, label: s.label }))} />
        ) : canClose ? (
          <Button onClick={() => setTicketStatus(ticket.id, "closed", persona.id)}>Approve & close</Button>
        ) : null}>
        <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} full />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>
            opened {relTime(ticket.createdAt)} by {requester?.displayName || "—"}
          </span>
        </div>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card>
            <Eyebrow style={{ marginBottom: 10 }}>DESCRIPTION</Eyebrow>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {ticket.description || "—"}
            </p>
          </Card>

          <Card>
            <Eyebrow style={{ marginBottom: 6 }}>
              <MessageSquare size={11} style={{ verticalAlign: "-1px", marginRight: 6 }} />TIMELINE
            </Eyebrow>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {timeline.map((ev) => <TimelineEvent key={ev.id} ev={ev} users={users} />)}
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
              <Textarea value={draft} onChange={(e) => setDraft(e.target.value)}
                placeholder={internal ? "Internal note — requester won't see this" : "Reply to the requester…"}
                style={internal ? { borderColor: "color-mix(in srgb, var(--warning) 45%, transparent)" } : {}} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                {canWork && <Switch size="sm" checked={internal} onChange={setInternal} label="Internal note" />}
                <span style={{ flex: 1 }} />
                <Button size="sm" iconLeft={<Send size={14} />} onClick={send} disabled={!draft.trim()}>
                  {internal ? "Add note" : "Send"}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card>
            <Eyebrow style={{ marginBottom: 4 }}>SLA</Eyebrow>
            <SlaRow label="First response" phase={sla.respond} satisfiedAt={ticket.firstResponseAt} />
            <SlaRow label="Resolution" phase={sla.resolve} satisfiedAt={ticket.resolvedAt} />
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--text-3)" }}>
              Targets follow the priority matrix. Warning fires at 80% of the limit.
            </p>
          </Card>

          {problem && (
            <Card>
              <Eyebrow style={{ marginBottom: 10 }}>
                <Boxes size={11} style={{ verticalAlign: "-1px", marginRight: 6 }} />ROOT-CAUSE PROBLEM
              </Eyebrow>
              <Link to={`/problems/${problem.id}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-faint)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-text)" }}>{problem.number}</span>
                  <span style={{ fontSize: 13, color: "var(--text-1)", flex: 1, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{problem.title}</span>
                  <Badge tone={PROBLEM_STATUS[problem.status]?.tone || "info"}>{PROBLEM_STATUS[problem.status]?.label}</Badge>
                </div>
              </Link>
              {problem.workaround && (
                <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-2)" }}>Workaround:</strong> {problem.workaround}
                </p>
              )}
            </Card>
          )}

          <Card>
            <Eyebrow style={{ marginBottom: 12 }}>PEOPLE</Eyebrow>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Avatar name={requester?.displayName || "?"} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500 }}>{requester?.displayName || "—"}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>requester · {requester?.department || "—"}</div>
              </div>
            </div>
            {hasPerm("tickets.assign") ? (
              <>
                <Select value={ticket.assigneeId || ""} size="sm" style={{ width: "100%" }}
                  onChange={(e) => assignTicket(ticket.id, e.target.value || null, persona.id)}
                  options={[{ value: "", label: "— unassigned —" },
                    ...technicians.map((u) => ({ value: u.id, label: u.displayName }))]} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em",
                    textTransform: "uppercase", color: "var(--text-3)", width: 80 }}>team</span>
                  <Select value={ticket.groupId || ""} size="sm" style={{ flex: 1 }}
                    onChange={(e) => setTicketGroup(ticket.id, e.target.value || null, persona.id)}
                    options={[{ value: "", label: "— no team —" },
                      ...groups.map((g) => ({ value: g.id, label: g.name }))]} />
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={assignee?.displayName || "?"} size={32} />
                <div>
                  <div style={{ fontSize: 13, color: assignee ? "var(--text-1)" : "var(--text-3)", fontWeight: 500 }}>
                    {assignee?.displayName || "Unassigned"}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>assignee</div>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <Eyebrow style={{ marginBottom: 12 }}>CLASSIFICATION</Eyebrow>
            {canWork ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[["category", TICKET_CATEGORIES], ["impact", LEVELS], ["urgency", LEVELS]].map(([k, opts]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em",
                      textTransform: "uppercase", color: "var(--text-3)", width: 80 }}>{k}</span>
                    <Select size="sm" value={ticket[k]} style={{ flex: 1 }}
                      onChange={(e) => saveTicketMeta(ticket.id, { [k]: e.target.value })}
                      options={Object.entries(opts).map(([v, o]) => ({ value: v, label: o.label }))} />
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em",
                    textTransform: "uppercase", color: "var(--text-3)", width: 80 }}>asset</span>
                  <Select size="sm" value={ticket.assetId || ""} style={{ flex: 1 }}
                    onChange={(e) => saveTicketMeta(ticket.id, { assetId: e.target.value || null })}
                    options={[{ value: "", label: "— none —" },
                      ...devices.map((d) => ({ value: d.id, label: `${d.name} · ${d.model}` }))]} />
                </div>
              </div>
            ) : (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-2)", lineHeight: 2 }}>
                {TICKET_CATEGORIES[ticket.category]?.label} · impact {ticket.impact} · urgency {ticket.urgency}
              </div>
            )}
            {asset && hasPerm("devices.read") && (
              <Link to={`/devices/${asset.id}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, padding: "10px 12px",
                  background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-faint)" }}>
                  {(() => { const T = (DEVICE_TYPES[asset.type] || DEVICE_TYPES.peripheral).icon;
                    return <T size={16} style={{ color: (DEVICE_TYPES[asset.type] || DEVICE_TYPES.peripheral).color }} />; })()}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-1)" }}>{asset.name}</span>
                  <span style={{ fontSize: 12, color: "var(--text-3)", flex: 1, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{asset.brand} {asset.model}</span>
                </div>
              </Link>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
