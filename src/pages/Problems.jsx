import { Boxes, Layers, Plus, Search } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  EmptyState,
  Field,
  HoverRow,
  PageHeader,
  SortableTh,
  StatCard,
  TableCard,
  tdStyle,
  useSort,
} from "../components/bits.jsx";
import { PriorityBadge, Textarea } from "../components/ticketBits.jsx";
import { Avatar, Badge, Button, Dialog, Input, Select } from "../ds";
import { computePriority, LEVELS, PROBLEM_OPEN_STATUSES, PROBLEM_STATUS, relTime } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

function ProblemStatusBadge({ status }) {
  const s = PROBLEM_STATUS[status] || PROBLEM_STATUS.open;
  return (
    <Badge tone={s.tone} dot pulse={status === "investigating"}>
      {s.label}
    </Badge>
  );
}

export function Problems() {
  const { problems, tickets, users, persona, addProblem, toast } = useStore();
  const nav = useNavigate();
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("open");
  const [creating, setCreating] = React.useState(false);
  const [form, setForm] = React.useState({});
  const [attempted, setAttempted] = React.useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const titleMissing = !form.title?.trim();

  const linkCount = (pid) => tickets.filter((t) => t.problemId === pid).length;
  const userById = (id) => users.find((u) => u.id === id);

  const needle = q.trim().toLowerCase();
  const filtered = problems.filter((p) => {
    if (status === "open" && !PROBLEM_OPEN_STATUSES.includes(p.status)) return false;
    if (status !== "open" && status !== "all" && p.status !== status) return false;
    if (!needle) return true;
    return [p.number, p.title, p.description].join(" ").toLowerCase().includes(needle);
  });

  const getters = React.useMemo(
    () => ({
      number: (p) => p.number,
      title: (p) => p.title,
      status: (p) => p.status,
      priority: (p) => computePriority(p.impact, p.urgency),
      tickets: (p) => linkCount(p.id),
      updated: (p) => p.updatedAt,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [linkCount],
  );
  const sort = useSort(filtered, getters, "priority", 1);

  const open = problems.filter((p) => PROBLEM_OPEN_STATUSES.includes(p.status));
  const knownErrors = problems.filter((p) => p.status === "known-error");

  const submit = () => {
    if (titleMissing) {
      setAttempted(true);
      toast("danger", "Title required", "Give the problem a short title.");
      return;
    }
    const id = addProblem({
      title: form.title.trim(),
      description: form.description || "",
      impact: form.impact || "medium",
      urgency: form.urgency || "medium",
      assigneeId: persona.id,
    });
    setCreating(false);
    setForm({});
    setAttempted(false);
    nav(`/problems/${id}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="CORE TICKETING"
        title="Problems"
        actions={
          <Button iconLeft={<Plus size={16} />} onClick={() => setCreating(true)}>
            New problem
          </Button>
        }
      >
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-3)" }}>
          Group recurring incidents under one root cause. Resolve the problem once, close the tickets together.
        </p>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 }}>
        <StatCard label="Open problems" value={open.length} />
        <StatCard
          label="Known errors"
          value={knownErrors.length}
          sub={knownErrors.length ? "with workaround" : ""}
          tone={knownErrors.length ? "warning" : undefined}
        />
        <StatCard label="Linked tickets" value={tickets.filter((t) => t.problemId).length} />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <Input
          placeholder="Search problems…"
          aria-label="Search problems"
          icon={<Search size={16} />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          wrapStyle={{ width: 260 }}
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: 170 }}
          aria-label="Filter by status"
          options={[
            { value: "open", label: "Open (active)" },
            { value: "all", label: "All statuses" },
            ...Object.entries(PROBLEM_STATUS).map(([v, s]) => ({ value: v, label: s.label })),
          ]}
        />
        <span style={{ alignSelf: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>
          {sort.sorted.length} of {problems.length}
        </span>
      </div>

      {sort.sorted.length === 0 ? (
        <EmptyState
          icon={<Boxes size={28} />}
          text="No problems match. Nothing systemic on fire right now."
          action={
            <Button size="sm" variant="secondary" onClick={() => setCreating(true)}>
              New problem
            </Button>
          }
        />
      ) : (
        <TableCard>
          <thead>
            <tr>
              <SortableTh k="number" sort={sort}>
                #
              </SortableTh>
              <SortableTh k="priority" sort={sort}>
                Priority
              </SortableTh>
              <SortableTh k="title" sort={sort}>
                Title
              </SortableTh>
              <SortableTh k="status" sort={sort}>
                Status
              </SortableTh>
              <SortableTh k="tickets" sort={sort}>
                Tickets
              </SortableTh>
              <SortableTh k="updated" sort={sort} align="right">
                Updated
              </SortableTh>
            </tr>
          </thead>
          <tbody>
            {sort.sorted.map((p) => {
              const asg = userById(p.assigneeId);
              return (
                <HoverRow key={p.id} onClick={() => nav(`/problems/${p.id}`)}>
                  <td style={{ ...tdStyle, color: "var(--accent-text)" }}>{p.number}</td>
                  <td style={tdStyle}>
                    <PriorityBadge priority={computePriority(p.impact, p.urgency)} />
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      fontFamily: "var(--font-sans)",
                      color: "var(--text-1)",
                      whiteSpace: "normal",
                      minWidth: 240,
                    }}
                  >
                    {p.title}
                    {asg && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          marginLeft: 8,
                          fontSize: 11,
                          color: "var(--text-3)",
                          verticalAlign: "middle",
                        }}
                      >
                        <Avatar name={asg.displayName} size={18} />
                        {asg.displayName}
                      </span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <ProblemStatusBadge status={p.status} />
                  </td>
                  <td style={tdStyle}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Layers size={13} style={{ color: "var(--text-3)" }} />
                      {linkCount(p.id)}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", color: "var(--text-3)" }}>{relTime(p.updatedAt)}</td>
                </HoverRow>
              );
            })}
          </tbody>
        </TableCard>
      )}

      <Dialog
        open={creating}
        onClose={() => setCreating(false)}
        title="New problem"
        description="Open a root-cause record, then link the incidents that share it."
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setCreating(false) },
          { label: "Create", variant: "primary", onClick: submit },
        ]}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Title" span={2} required error={attempted && titleMissing ? "Title is required" : null}>
            <Input
              value={form.title || ""}
              onChange={set("title")}
              autoFocus
              invalid={attempted && titleMissing}
              placeholder="e.g. VPN gateway drops sessions under load"
            />
          </Field>
          <Field label="Description" span={2}>
            <Textarea
              value={form.description || ""}
              onChange={set("description")}
              placeholder="What's the shared symptom across the incidents?"
            />
          </Field>
          <Field label="Impact">
            <Select
              value={form.impact || "medium"}
              onChange={set("impact")}
              style={{ width: "100%" }}
              options={Object.entries(LEVELS).map(([v, l]) => ({ value: v, label: l.label }))}
            />
          </Field>
          <Field label="Urgency">
            <Select
              value={form.urgency || "medium"}
              onChange={set("urgency")}
              style={{ width: "100%" }}
              options={Object.entries(LEVELS).map(([v, l]) => ({ value: v, label: l.label }))}
            />
          </Field>
        </div>
      </Dialog>
    </>
  );
}
