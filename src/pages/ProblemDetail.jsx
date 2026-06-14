import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, X, Plus, Save } from "lucide-react";
import { Card, Badge, Button, Select, Avatar, Dialog } from "../ds";
import { PageHeader, Eyebrow, rowActivation } from "../components/bits.jsx";
import { PriorityBadge, StatusBadge, Textarea } from "../components/ticketBits.jsx";
import {
  PROBLEM_STATUS, LEVELS, OPEN_STATUSES, computePriority, relTime,
} from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

export function ProblemDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const {
    problems, tickets, users, persona, hasPerm,
    saveProblem, setProblemStatus, deleteProblem, linkTicketToProblem,
  } = useStore();

  const problem = problems.find((p) => p.id === id);
  const canWork = hasPerm("tickets.edit");

  const [linking, setLinking] = React.useState(false);
  const [pick, setPick] = React.useState("");
  const [rootCause, setRootCause] = React.useState(problem?.rootCause || "");
  const [workaround, setWorkaround] = React.useState(problem?.workaround || "");

  React.useEffect(() => {
    setRootCause(problem?.rootCause || "");
    setWorkaround(problem?.workaround || "");
  }, [problem?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!problem) {
    return (
      <>
        <Button variant="ghost" size="sm" iconLeft={<ArrowLeft size={15} />} onClick={() => nav("/problems")}>Problems</Button>
        <p style={{ color: "var(--text-2)" }}>This problem doesn't exist anymore.</p>
      </>
    );
  }

  const linked = tickets.filter((t) => t.problemId === problem.id);
  const linkable = tickets.filter((t) => !t.problemId && OPEN_STATUSES.includes(t.status));
  const assignee = users.find((u) => u.id === problem.assigneeId);
  const technicians = users.filter((u) => u.groups?.some((g) => ["IT-Admins", "IT-Support", "IT-Supervisors"].includes(g)));
  const userById = (uid2) => users.find((u) => u.id === uid2);
  const priority = computePriority(problem.impact, problem.urgency);
  const dirty = rootCause !== (problem.rootCause || "") || workaround !== (problem.workaround || "");

  const doLink = () => { if (pick) linkTicketToProblem(pick, problem.id); setPick(""); setLinking(false); };

  return (
    <>
      <Button variant="ghost" size="sm" iconLeft={<ArrowLeft size={15} />}
        onClick={() => nav("/problems")} style={{ marginBottom: 10 }}>Problems</Button>

      <PageHeader eyebrow={`${problem.number} · PROBLEM`} title={problem.title}
        actions={canWork && (
          <span style={{ display: "inline-flex", gap: 8 }}>
            <Select value={problem.status} onChange={(e) => setProblemStatus(problem.id, e.target.value)}
              options={Object.entries(PROBLEM_STATUS).map(([v, s]) => ({ value: v, label: s.label }))} />
            <Button variant="ghost" onClick={() => { deleteProblem(problem.id); nav("/problems"); }}
              style={{ color: "var(--danger)" }}><Trash2 size={15} /></Button>
          </span>
        )}>
        <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Badge tone={PROBLEM_STATUS[problem.status]?.tone || "info"} dot>{PROBLEM_STATUS[problem.status]?.label}</Badge>
          <PriorityBadge priority={priority} full />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>
            opened {relTime(problem.createdAt)} · updated {relTime(problem.updatedAt)}
          </span>
        </div>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card>
            <Eyebrow style={{ marginBottom: 10 }}>DESCRIPTION</Eyebrow>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {problem.description || "—"}
            </p>
          </Card>

          <Card>
            <Eyebrow style={{ marginBottom: 10 }}>ROOT CAUSE</Eyebrow>
            {canWork ? (
              <Textarea value={rootCause} onChange={(e) => setRootCause(e.target.value)}
                placeholder="What is actually causing all these incidents?" />
            ) : (
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {problem.rootCause || "Under investigation."}
              </p>
            )}
            <Eyebrow style={{ margin: "16px 0 10px" }}>WORKAROUND</Eyebrow>
            {canWork ? (
              <Textarea value={workaround} onChange={(e) => setWorkaround(e.target.value)}
                placeholder="Temporary mitigation while the root cause is fixed." />
            ) : (
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {problem.workaround || "—"}
              </p>
            )}
            {canWork && (
              <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                <Button size="sm" iconLeft={<Save size={14} />} disabled={!dirty}
                  onClick={() => saveProblem(problem.id, { rootCause, workaround })}>Save</Button>
              </div>
            )}
          </Card>

          <Card padding="0">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px 10px" }}>
              <Eyebrow>LINKED TICKETS · {linked.length}</Eyebrow>
              {canWork && (
                <Button size="sm" variant="secondary" iconLeft={<Plus size={14} />}
                  onClick={() => setLinking(true)} disabled={linkable.length === 0}>Link ticket</Button>
              )}
            </div>
            {linked.length === 0 ? (
              <p style={{ padding: "0 18px 16px", margin: 0, color: "var(--text-3)", fontSize: 13 }}>
                No incidents linked yet. Link the tickets that share this root cause.
              </p>
            ) : (
              linked.map((t) => {
                const req = userById(t.requesterId);
                return (
                  <div key={t.id} {...rowActivation(() => nav(`/tickets/${t.id}`))}
                    aria-label={`Ticket ${t.number}: ${t.title}`}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px",
                    borderTop: "1px solid var(--border-faint)", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-text)", flex: "0 0 auto" }}>{t.number}</span>
                    <PriorityBadge priority={t.priority} />
                    <span style={{ fontSize: 13, color: "var(--text-1)", flex: 1, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{req?.displayName || "—"}</span>
                    <StatusBadge status={t.status} />
                    {canWork && (
                      <Button variant="ghost" size="sm" title="Unlink"
                        onClick={(e) => { e.stopPropagation(); linkTicketToProblem(t.id, null); }}><X size={14} /></Button>
                    )}
                  </div>
                );
              })
            )}
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card>
            <Eyebrow style={{ marginBottom: 12 }}>OWNER</Eyebrow>
            {hasPerm("tickets.assign") ? (
              <Select value={problem.assigneeId || ""} size="sm" style={{ width: "100%" }}
                onChange={(e) => saveProblem(problem.id, { assigneeId: e.target.value || null })}
                options={[{ value: "", label: "— unassigned —" },
                  ...technicians.map((u) => ({ value: u.id, label: u.displayName }))]} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={assignee?.displayName || "?"} size={32} />
                <div style={{ fontSize: 13, color: assignee ? "var(--text-1)" : "var(--text-3)" }}>
                  {assignee?.displayName || "Unassigned"}
                </div>
              </div>
            )}
          </Card>

          <Card>
            <Eyebrow style={{ marginBottom: 12 }}>CLASSIFICATION</Eyebrow>
            {canWork ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[["impact", LEVELS], ["urgency", LEVELS]].map(([k, opts]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em",
                      textTransform: "uppercase", color: "var(--text-3)", width: 80 }}>{k}</span>
                    <Select size="sm" value={problem[k]} style={{ flex: 1 }}
                      onChange={(e) => saveProblem(problem.id, { [k]: e.target.value })}
                      options={Object.entries(opts).map(([v, o]) => ({ value: v, label: o.label }))} />
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em",
                    textTransform: "uppercase", color: "var(--text-3)", width: 80 }}>priority</span>
                  <PriorityBadge priority={priority} full />
                </div>
              </div>
            ) : (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-2)", lineHeight: 2 }}>
                impact {problem.impact} · urgency {problem.urgency}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={linking} onClose={() => setLinking(false)} title="Link a ticket"
        description="Attach an open incident that shares this root cause."
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setLinking(false) },
          { label: "Link", variant: "primary", onClick: doLink },
        ]}>
        {linkable.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-3)" }}>No unlinked open tickets available.</p>
        ) : (
          <Select value={pick} onChange={(e) => setPick(e.target.value)} style={{ width: "100%" }}
            options={[{ value: "", label: "— choose a ticket —" },
              ...linkable.map((t) => ({ value: t.id, label: `${t.number} · ${t.title}` }))]} />
        )}
      </Dialog>
    </>
  );
}
