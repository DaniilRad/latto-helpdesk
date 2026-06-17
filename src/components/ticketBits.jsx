import React from "react";
import { Badge } from "../ds";
import { dueIn, PRIORITY, SLA_TONES, slaState, TICKET_STATUS } from "../lib/meta.js";

export function PriorityBadge({ priority, full = false }) {
  const p = PRIORITY[priority] || PRIORITY[3];
  return <Badge tone={p.tone}>{full ? p.label : p.short}</Badge>;
}

export function StatusBadge({ status }) {
  const s = TICKET_STATUS[status] || TICKET_STATUS.new;
  return (
    <Badge tone={s.tone} dot pulse={status === "in-progress"}>
      {s.label}
    </Badge>
  );
}

/**
 * Compact SLA indicator for ticket lists: shows the most urgent of the two
 * phases (respond/resolve) with a countdown.
 */
export function SlaBadge({ ticket }) {
  if (ticket.status === "closed") return <Badge tone="neutral">closed</Badge>;
  const sla = slaState(ticket);
  // respond phase first if still open, else resolve phase
  const phase = ticket.firstResponseAt ? sla.resolve : sla.respond;
  const label = ticket.firstResponseAt ? "resolve" : "respond";
  if (phase.state === "met") return <Badge tone="success">met</Badge>;
  if (phase.state === "late") return <Badge tone="danger">late</Badge>;
  return (
    <Badge tone={SLA_TONES[phase.state]} dot pulse={phase.state === "breached"}>
      {label} {dueIn(phase.due)}
    </Badge>
  );
}

/** Multiline text control styled like the DS Input. */
export function Textarea({ style = {}, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <textarea
      {...rest}
      onFocus={(e) => {
        setFocus(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocus(false);
        rest.onBlur?.(e);
      }}
      style={{
        width: "100%",
        minHeight: 92,
        resize: "vertical",
        padding: "10px 12px",
        background: "var(--surface-2)",
        border: `1px solid ${focus ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focus ? "var(--ring)" : "none",
        color: "var(--text-1)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-sm)",
        lineHeight: 1.5,
        outline: "none",
        transition: "border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)",
        ...style,
      }}
    />
  );
}
