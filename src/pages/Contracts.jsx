import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Badge, Dialog, Input, Select } from "../ds";
import { PageHeader, TableCard, HoverRow, tdStyle, Field, SortableTh, useSort, TableEmptyRow } from "../components/bits.jsx";
import { CONTRACT_TYPES, formatDate, daysUntil } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

export function Contracts() {
  const { contracts, addContract, deleteContract, hasPerm, toast } = useStore();
  const canEdit = hasPerm("devices.write");
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const getters = React.useMemo(() => ({
    name: (c) => c.name, type: (c) => c.type, vendor: (c) => c.vendor,
    start: (c) => c.startDate, end: (c) => c.endDate, cost: (c) => c.cost,
  }), []);
  const sort = useSort(contracts, getters, "end", 1);

  const submit = () => {
    if (!form.name?.trim()) { toast("danger", "Name required", "Give the contract or certificate a name."); return; }
    addContract({ name: form.name.trim(), type: form.type || "contract", vendor: form.vendor || "",
      number: form.number || "", startDate: form.startDate || "", endDate: form.endDate || "",
      cost: form.cost || "", notes: form.notes || "" });
    setAdding(false); setForm({});
  };

  return (
    <>
      <PageHeader eyebrow="INVENTORY" title="Contracts & certificates"
        actions={canEdit && <Button iconLeft={<Plus size={16} />} onClick={() => setAdding(true)}>Add</Button>}>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-3)" }}>
          Vendor contracts and SSL/TLS certificates with expiry tracking.
        </p>
      </PageHeader>

      <TableCard>
        <thead><tr>
          <SortableTh k="type" sort={sort}>Type</SortableTh>
          <SortableTh k="name" sort={sort}>Name</SortableTh>
          <SortableTh k="vendor" sort={sort}>Vendor</SortableTh>
          <SortableTh k="end" sort={sort}>Ends</SortableTh>
          <SortableTh k="cost" sort={sort}>Cost</SortableTh>
          <th style={{ ...tdStyle, borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)",
            fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-3)" }}>Notes</th>
          <th style={{ ...tdStyle, borderBottom: "1px solid var(--border)" }} />
        </tr></thead>
        <tbody>
          {sort.sorted.length === 0 && <TableEmptyRow colSpan={7}>No contracts or certificates yet.</TableEmptyRow>}
          {sort.sorted.map((c) => {
            const days = daysUntil(c.endDate);
            return (
              <HoverRow key={c.id}>
                <td style={tdStyle}>
                  <Badge tone={CONTRACT_TYPES[c.type]?.tone || "info"}>{CONTRACT_TYPES[c.type]?.label || c.type}</Badge>
                </td>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-1)", fontWeight: 500 }}>
                  {c.name}
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{c.number}</div>
                </td>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>{c.vendor}</td>
                <td style={tdStyle}>
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    {formatDate(c.endDate)}
                    {days != null && days <= 90 && (
                      <Badge tone={days < 0 ? "danger" : days <= 30 ? "warning" : "neutral"}>
                        {days < 0 ? "expired" : `${days}d`}
                      </Badge>
                    )}
                  </span>
                </td>
                <td style={tdStyle}>{c.cost || "—"}</td>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-3)", whiteSpace: "normal", maxWidth: 260 }}>
                  {c.notes || "—"}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {canEdit && <Button variant="ghost" size="sm" onClick={() => deleteContract(c.id)}><Trash2 size={14} /></Button>}
                </td>
              </HoverRow>
            );
          })}
        </tbody>
      </TableCard>

      <Dialog open={adding} onClose={() => setAdding(false)} title="Add contract / certificate"
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setAdding(false) },
          { label: "Add", variant: "primary", onClick: submit },
        ]}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Type">
            <Select value={form.type || "contract"} onChange={set("type")} style={{ width: "100%" }}
              options={Object.entries(CONTRACT_TYPES).map(([v, t]) => ({ value: v, label: t.label }))} />
          </Field>
          <Field label="Vendor"><Input value={form.vendor || ""} onChange={set("vendor")} /></Field>
          <Field label="Name" span={2} required><Input value={form.name || ""} onChange={set("name")} autoFocus /></Field>
          <Field label="Number / CN"><Input value={form.number || ""} onChange={set("number")} placeholder="*.latto.io" /></Field>
          <Field label="Cost"><Input value={form.cost || ""} onChange={set("cost")} placeholder="€ 180 / y" /></Field>
          <Field label="Starts"><Input type="date" value={form.startDate || ""} onChange={set("startDate")} /></Field>
          <Field label="Ends"><Input type="date" value={form.endDate || ""} onChange={set("endDate")} /></Field>
          <Field label="Notes" span={2}><Input value={form.notes || ""} onChange={set("notes")} /></Field>
        </div>
      </Dialog>
    </>
  );
}
