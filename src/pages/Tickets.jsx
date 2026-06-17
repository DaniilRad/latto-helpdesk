import { Bookmark, BookmarkPlus, Inbox, Plus, Search, X } from "lucide-react";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  EmptyState,
  Field,
  HoverRow,
  PageHeader,
  SortableTh,
  StatCard,
  TableCard,
  tdStyle,
  thStyle,
  useSort,
} from "../components/bits.jsx";
import { TicketDialog } from "../components/TicketDialog.jsx";
import { PriorityBadge, SlaBadge, StatusBadge } from "../components/ticketBits.jsx";
import { Avatar, Badge, Button, Dialog, Input, Select } from "../ds";
import { OPEN_STATUSES, relTime, slaState, TICKET_STATUS } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

export function Tickets() {
  const { tickets, users, persona, hasPerm, savedSearches, addSavedSearch, deleteSavedSearch } = useStore();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const seeAll = hasPerm("tickets.all");

  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState(params.get("status") || "open");
  const [assignee, setAssignee] = React.useState(params.get("assignee") || "all");
  const [creating, setCreating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [searchName, setSearchName] = React.useState("");

  const applySearch = (s) => {
    setQ(s.q || "");
    setStatus(s.status || "open");
    setAssignee(s.assignee || "all");
  };
  const saveCurrent = () => {
    if (!searchName.trim()) return;
    addSavedSearch({ name: searchName.trim(), q, status, assignee });
    setSearchName("");
    setSaving(false);
  };
  const isDefault = !q && status === "open" && assignee === "all";

  const visible = seeAll ? tickets : tickets.filter((t) => t.requesterId === persona.id);
  const userById = (id) => users.find((u) => u.id === id);

  const needle = q.trim().toLowerCase();
  const filtered = visible
    .filter((t) => {
      if (status === "open" && !OPEN_STATUSES.includes(t.status)) return false;
      if (status !== "open" && status !== "all" && t.status !== status) return false;
      if (assignee === "me" && t.assigneeId !== persona.id) return false;
      if (assignee === "none" && t.assigneeId) return false;
      if (!needle) return true;
      const hay = [t.number, t.title, t.description, userById(t.requesterId)?.displayName || ""]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    })
    .sort((a, b) => a.priority - b.priority || new Date(b.updatedAt) - new Date(a.updatedAt));

  const getters = React.useMemo(
    () => ({
      number: (t) => t.number,
      priority: (t) => t.priority,
      title: (t) => t.title,
      status: (t) => TICKET_STATUS[t.status]?.label || t.status,
      requester: (t) => userById(t.requesterId)?.displayName,
      assignee: (t) => userById(t.assigneeId)?.displayName,
      updated: (t) => t.updatedAt,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [userById],
  );
  const sort = useSort(filtered, getters, null, 1);

  const open = visible.filter((t) => OPEN_STATUSES.includes(t.status));
  const atRisk = open.filter((t) => {
    const s = slaState(t);
    return ["risk", "breached"].includes(s.respond.state) || ["risk", "breached"].includes(s.resolve.state);
  });
  const unassigned = open.filter((t) => !t.assigneeId);
  const mine = open.filter((t) => t.assigneeId === persona.id);

  return (
    <>
      <PageHeader
        eyebrow="CORE TICKETING"
        title={seeAll ? "Tickets" : "My tickets"}
        actions={
          <Button iconLeft={<Plus size={16} />} onClick={() => setCreating(true)}>
            New ticket
          </Button>
        }
      />

      {seeAll && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
          <StatCard label="Open" value={open.length} />
          <StatCard
            label="SLA at risk"
            value={atRisk.length}
            sub={atRisk.length ? "act now" : "all green"}
            tone={atRisk.length ? "danger" : "success"}
          />
          <StatCard label="Unassigned" value={unassigned.length} tone={unassigned.length ? "warning" : undefined} />
          <StatCard label="My queue" value={mine.length} />
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <Input
          placeholder="Search tickets…"
          aria-label="Search tickets"
          icon={<Search size={16} />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          wrapStyle={{ width: 260 }}
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: 160 }}
          aria-label="Filter by status"
          options={[
            { value: "open", label: "Open (active)" },
            { value: "all", label: "All statuses" },
            ...Object.entries(TICKET_STATUS).map(([v, s]) => ({ value: v, label: s.label })),
          ]}
        />
        {seeAll && (
          <Select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            style={{ width: 160 }}
            aria-label="Filter by assignee"
            options={[
              { value: "all", label: "Any assignee" },
              { value: "me", label: "Assigned to me" },
              { value: "none", label: "Unassigned" },
            ]}
          />
        )}
        <span style={{ alignSelf: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>
          {filtered.length} of {visible.length}
        </span>
        <span style={{ flex: 1 }} />
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<BookmarkPlus size={14} />}
          disabled={isDefault}
          onClick={() => setSaving(true)}
        >
          Save search
        </Button>
      </div>

      {savedSearches.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
          <Bookmark size={14} style={{ color: "var(--text-3)" }} />
          {savedSearches.map((s) => (
            <span
              key={s.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                padding: "0 6px 0 0",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                fontSize: 12,
                color: "var(--text-1)",
              }}
            >
              <button
                type="button"
                onClick={() => applySearch(s)}
                title="Apply saved search"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "inherit",
                  font: "inherit",
                  cursor: "pointer",
                  padding: "4px 4px 4px 12px",
                }}
              >
                {s.name}
              </button>
              <button
                type="button"
                onClick={() => deleteSavedSearch(s.id)}
                style={{
                  display: "inline-flex",
                  border: "none",
                  background: "transparent",
                  color: "var(--text-3)",
                  cursor: "pointer",
                  padding: 2,
                  borderRadius: "var(--radius-full)",
                }}
                title="Delete saved search"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox size={28} />}
          text="No tickets match. That's either great news or a filter problem."
          action={
            <Button size="sm" variant="secondary" onClick={() => setCreating(true)}>
              New ticket
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
              <th style={thStyle}>SLA</th>
              <SortableTh k="requester" sort={sort}>
                Requester
              </SortableTh>
              {seeAll && (
                <SortableTh k="assignee" sort={sort}>
                  Assignee
                </SortableTh>
              )}
              <SortableTh k="updated" sort={sort} align="right">
                Updated
              </SortableTh>
            </tr>
          </thead>
          <tbody>
            {sort.sorted.map((t) => {
              const req = userById(t.requesterId);
              const asg = userById(t.assigneeId);
              return (
                <HoverRow key={t.id} onClick={() => nav(`/tickets/${t.id}`)}>
                  <td style={{ ...tdStyle, color: "var(--accent-text)" }}>{t.number}</td>
                  <td style={tdStyle}>
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      fontFamily: "var(--font-sans)",
                      color: "var(--text-1)",
                      whiteSpace: "normal",
                      minWidth: 220,
                    }}
                  >
                    {t.title}
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={t.status} />
                  </td>
                  <td style={tdStyle}>
                    <SlaBadge ticket={t} />
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={req?.displayName || "?"} size={22} />
                      {req?.displayName || "—"}
                    </span>
                  </td>
                  {seeAll && (
                    <td
                      style={{
                        ...tdStyle,
                        fontFamily: "var(--font-sans)",
                        color: asg ? "var(--text-1)" : "var(--text-3)",
                      }}
                    >
                      {asg?.displayName || "—"}
                    </td>
                  )}
                  <td style={{ ...tdStyle, textAlign: "right", color: "var(--text-3)" }}>{relTime(t.updatedAt)}</td>
                </HoverRow>
              );
            })}
          </tbody>
        </TableCard>
      )}

      <TicketDialog open={creating} onClose={() => setCreating(false)} onCreated={(id) => nav(`/tickets/${id}`)} />

      <Dialog
        open={saving}
        onClose={() => setSaving(false)}
        title="Save this search"
        description="Store the current search and filters to recall them in one click."
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setSaving(false) },
          { label: "Save", variant: "primary", onClick: saveCurrent },
        ]}
      >
        <Field label="Name">
          <Input
            value={searchName}
            autoFocus
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveCurrent()}
            placeholder="e.g. My unassigned P1s"
          />
        </Field>
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
          <Badge tone="neutral">search: {q || "—"}</Badge>
          <Badge tone="neutral">status: {status}</Badge>
          {seeAll && <Badge tone="neutral">assignee: {assignee}</Badge>}
        </div>
      </Dialog>
    </>
  );
}
