import React from "react";
import { Plus, Trash2, CalendarClock } from "lucide-react";
import { Button, Badge, Dialog, Input, Select } from "../ds";
import { PageHeader, TableCard, HoverRow, tdStyle, EmptyState, Field, SortableTh, useSort } from "../components/bits.jsx";
import { formatDateTime } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

export function Reservations() {
  const { reservations, devices, users, persona, hasPerm, addReservation, deleteReservation } = useStore();
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canManage = hasPerm("tickets.edit");

  // Reservable pool: spare/in-stock gear plus anything unassigned.
  const pool = devices.filter((d) => d.status === "in-stock" || (!d.assignedTo && d.status === "in-use"));

  const now = new Date();
  const status = (r) => (new Date(r.to) < now ? "past" : new Date(r.from) <= now ? "active" : "upcoming");
  const tones = { active: "success", upcoming: "info", past: "neutral" };

  const getters = React.useMemo(() => ({
    asset: (r) => devices.find((d) => d.id === r.assetId)?.name,
    who: (r) => users.find((u) => u.id === r.userId)?.displayName,
    from: (r) => r.from, to: (r) => r.to, status: (r) => status(r),
  }), [devices, users]);
  const sort = useSort(reservations, getters, "from", 1);

  const submit = () => {
    if (!form.assetId || !form.from || !form.to) return;
    if (new Date(form.from) >= new Date(form.to)) return;
    const ok = addReservation({
      assetId: form.assetId, userId: form.userId || persona.id,
      from: new Date(form.from).toISOString(), to: new Date(form.to).toISOString(),
      note: form.note || "",
    });
    if (ok) { setAdding(false); setForm({}); }
  };

  return (
    <>
      <PageHeader eyebrow="TOOLS" title="Reservations"
        actions={<Button iconLeft={<Plus size={16} />} onClick={() => setAdding(true)}>Reserve asset</Button>}>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-3)" }}>
          Shared gear — spare notebooks, phones, projectors. Overlaps are rejected.
        </p>
      </PageHeader>

      {reservations.length === 0 ? (
        <EmptyState icon={<CalendarClock size={28} />} text="Nothing reserved. The spare gear is all yours."
          action={<Button size="sm" variant="secondary" onClick={() => setAdding(true)}>Reserve asset</Button>} />
      ) : (
        <TableCard>
          <thead><tr>
            <SortableTh k="asset" sort={sort}>Asset</SortableTh>
            <SortableTh k="who" sort={sort}>Reserved by</SortableTh>
            <SortableTh k="from" sort={sort}>From</SortableTh>
            <SortableTh k="to" sort={sort}>To</SortableTh>
            <SortableTh k="status" sort={sort}>Status</SortableTh>
            <th style={{ ...tdStyle, borderBottom: "1px solid var(--border)" }} />
          </tr></thead>
          <tbody>
            {sort.sorted.map((r) => {
              const st = status(r);
              return (
                <HoverRow key={r.id}>
                  <td style={{ ...tdStyle, color: "var(--text-1)" }}>{devices.find((d) => d.id === r.assetId)?.name || "—"}</td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>{users.find((u) => u.id === r.userId)?.displayName || "—"}</td>
                  <td style={tdStyle}>{formatDateTime(r.from)}</td>
                  <td style={tdStyle}>{formatDateTime(r.to)}</td>
                  <td style={tdStyle}><Badge tone={tones[st]} dot pulse={st === "active"}>{st}</Badge></td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    {(canManage || r.userId === persona.id) && (
                      <Button variant="ghost" size="sm" onClick={() => deleteReservation(r.id)}><Trash2 size={14} /></Button>
                    )}
                  </td>
                </HoverRow>
              );
            })}
          </tbody>
        </TableCard>
      )}

      <Dialog open={adding} onClose={() => setAdding(false)} title="Reserve an asset"
        description="Pick a shared asset and a time window."
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setAdding(false) },
          { label: "Reserve", variant: "primary", onClick: submit },
        ]}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Asset" span={2}>
            <Select value={form.assetId || ""} onChange={set("assetId")} style={{ width: "100%" }}
              options={[{ value: "", label: "— choose —" },
                ...pool.map((d) => ({ value: d.id, label: `${d.name} · ${d.model}` }))]} />
          </Field>
          {canManage && (
            <Field label="For user" span={2}>
              <Select value={form.userId || persona.id} onChange={set("userId")} style={{ width: "100%" }}
                options={users.filter((u) => u.status === "enabled").map((u) => ({ value: u.id, label: u.displayName }))} />
            </Field>
          )}
          <Field label="From">
            <Input type="datetime-local" value={form.from || ""} onChange={set("from")} />
          </Field>
          <Field label="To">
            <Input type="datetime-local" value={form.to || ""} onChange={set("to")} />
          </Field>
          <Field label="Note" span={2}>
            <Input value={form.note || ""} onChange={set("note")} placeholder="What's it for?" />
          </Field>
        </div>
      </Dialog>
    </>
  );
}
