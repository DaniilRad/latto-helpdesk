import React from "react";
import { Dialog, Input, Select } from "../ds";
import { computePriority, LEVELS, PRIORITY, TICKET_CATEGORIES } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";
import { Field } from "./bits.jsx";
import { Textarea } from "./ticketBits.jsx";

/**
 * New ticket dialog. End-users get a simplified form (no requester/assignee
 * pickers — they file for themselves).
 */
export function TicketDialog({ open, onClose, onCreated }) {
  const { users, devices, persona, hasPerm, addTicket, toast } = useStore();
  const full = hasPerm("tickets.edit");
  const [form, setForm] = React.useState({});
  const [attempted, setAttempted] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setAttempted(false);
      setForm({
        title: "",
        description: "",
        category: "incident",
        impact: "medium",
        urgency: "medium",
        requesterId: persona.id,
        assigneeId: "",
        assetId: "",
      });
    }
  }, [open, persona]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const priority = computePriority(form.impact, form.urgency);
  const titleMissing = !form.title?.trim();

  const submit = () => {
    if (titleMissing) {
      setAttempted(true);
      toast("danger", "Title required", "Give the ticket a short title before creating it.");
      return;
    }
    const id = addTicket(
      {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        impact: form.impact,
        urgency: form.urgency,
        requesterId: form.requesterId,
        assigneeId: form.assigneeId || null,
        assetId: form.assetId || null,
      },
      persona.id,
    );
    onClose();
    onCreated?.(id);
  };

  const technicians = users.filter((u) =>
    u.groups?.some((g) => ["IT-Admins", "IT-Support", "IT-Supervisors"].includes(g)),
  );
  const myDevices = devices.filter((d) => d.assignedTo === persona.id);
  const assetPool = full ? devices : myDevices;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={620}
      title="New ticket"
      description={full ? undefined : "Describe the problem — we'll take it from there."}
      actions={[
        { label: "Cancel", variant: "ghost", onClick: onClose },
        { label: "Create ticket", variant: "primary", onClick: submit },
      ]}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Title" span={2} required error={attempted && titleMissing ? "Title is required" : null}>
          <Input
            value={form.title || ""}
            onChange={set("title")}
            placeholder="Short summary of the problem"
            invalid={attempted && titleMissing}
            autoFocus
          />
        </Field>
        <Field label="Description" span={2}>
          <Textarea
            value={form.description || ""}
            onChange={set("description")}
            placeholder="What happened, since when, what did you try?"
          />
        </Field>
        <Field label="Category">
          <Select
            value={form.category}
            onChange={set("category")}
            style={{ width: "100%" }}
            options={Object.entries(TICKET_CATEGORIES).map(([v, c]) => ({ value: v, label: c.label }))}
          />
        </Field>
        {full ? (
          <Field label="Requester">
            <Select
              value={form.requesterId}
              onChange={set("requesterId")}
              style={{ width: "100%" }}
              options={users.map((u) => ({ value: u.id, label: `${u.displayName} (${u.sam})` }))}
            />
          </Field>
        ) : (
          <Field label="Affected device">
            <Select
              value={form.assetId}
              onChange={set("assetId")}
              style={{ width: "100%" }}
              options={[
                { value: "", label: "— none / not sure —" },
                ...assetPool.map((d) => ({ value: d.id, label: `${d.name} · ${d.model}` })),
              ]}
            />
          </Field>
        )}
        <Field label="Impact">
          <Select
            value={form.impact}
            onChange={set("impact")}
            style={{ width: "100%" }}
            options={Object.entries(LEVELS).map(([v, l]) => ({ value: v, label: l.label }))}
          />
        </Field>
        <Field label="Urgency">
          <Select
            value={form.urgency}
            onChange={set("urgency")}
            style={{ width: "100%" }}
            options={Object.entries(LEVELS).map(([v, l]) => ({ value: v, label: l.label }))}
          />
        </Field>
        {full && (
          <>
            <Field label="Assign to">
              <Select
                value={form.assigneeId}
                onChange={set("assigneeId")}
                style={{ width: "100%" }}
                options={[
                  { value: "", label: "— unassigned —" },
                  ...technicians.map((u) => ({ value: u.id, label: u.displayName })),
                ]}
              />
            </Field>
            <Field label="Linked asset">
              <Select
                value={form.assetId}
                onChange={set("assetId")}
                style={{ width: "100%" }}
                options={[
                  { value: "", label: "— none —" },
                  ...assetPool.map((d) => ({ value: d.id, label: `${d.name} · ${d.model}` })),
                ]}
              />
            </Field>
          </>
        )}
        <div
          style={{
            gridColumn: "span 2",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            background: "var(--surface-2)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-faint)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--text-3)",
            }}
          >
            Computed priority
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-1)" }}>
            {PRIORITY[priority].label}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: "auto" }}>impact × urgency</span>
        </div>
      </div>
    </Dialog>
  );
}
