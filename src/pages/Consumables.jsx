import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import {
  Field,
  HoverRow,
  PageHeader,
  SortableTh,
  TableCard,
  TableEmptyRow,
  tdStyle,
  useSort,
} from "../components/bits.jsx";
import { Badge, Button, Dialog, IconButton, Input, Select } from "../ds";
import { CONSUMABLE_TYPES } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

export function Consumables() {
  const { consumables, addConsumable, deleteConsumable, adjustStock, hasPerm, toast } = useStore();
  const canEdit = hasPerm("devices.write");
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const getters = React.useMemo(
    () => ({
      name: (c) => c.name,
      type: (c) => CONSUMABLE_TYPES[c.type]?.label,
      stock: (c) => c.stock,
      min: (c) => c.min,
      location: (c) => c.location,
    }),
    [],
  );
  const sort = useSort(consumables, getters, "name", 1);

  const submit = () => {
    if (!form.name?.trim()) {
      toast("danger", "Name required", "Give the consumable a name.");
      return;
    }
    addConsumable({
      name: form.name.trim(),
      type: form.type || "other",
      stock: Number(form.stock) || 0,
      min: Number(form.min) || 0,
      location: form.location || "",
      notes: form.notes || "",
    });
    setAdding(false);
    setForm({});
  };

  const low = consumables.filter((c) => c.stock < c.min).length;

  return (
    <>
      <PageHeader
        eyebrow="INVENTORY"
        title="Consumables"
        actions={
          canEdit && (
            <Button iconLeft={<Plus size={16} />} onClick={() => setAdding(true)}>
              Add item
            </Button>
          )
        }
      >
        {low > 0 && (
          <div style={{ marginTop: 10 }}>
            <Badge tone="danger" dot>
              {low} below minimum — reorder
            </Badge>
          </div>
        )}
      </PageHeader>

      <TableCard>
        <thead>
          <tr>
            <SortableTh k="name" sort={sort}>
              Item
            </SortableTh>
            <SortableTh k="type" sort={sort}>
              Type
            </SortableTh>
            <SortableTh k="stock" sort={sort}>
              Stock
            </SortableTh>
            <SortableTh k="location" sort={sort}>
              Location
            </SortableTh>
            <th
              style={{
                ...tdStyle,
                borderBottom: "1px solid var(--border)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--text-3)",
              }}
            >
              Notes
            </th>
            <th style={{ ...tdStyle, borderBottom: "1px solid var(--border)" }} />
          </tr>
        </thead>
        <tbody>
          {sort.sorted.length === 0 && <TableEmptyRow colSpan={6}>No consumables tracked yet.</TableEmptyRow>}
          {sort.sorted.map((c) => (
            <HoverRow key={c.id}>
              <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-1)", fontWeight: 500 }}>
                {c.name}
              </td>
              <td style={tdStyle}>{CONSUMABLE_TYPES[c.type]?.label || c.type}</td>
              <td style={tdStyle}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {canEdit && (
                    <IconButton label="Take one" size="sm" onClick={() => adjustStock(c.id, -1)}>
                      <Minus size={13} />
                    </IconButton>
                  )}
                  <Badge tone={c.stock < c.min ? "danger" : c.stock === c.min ? "warning" : "success"}>
                    {c.stock} / min {c.min}
                  </Badge>
                  {canEdit && (
                    <IconButton label="Add one" size="sm" onClick={() => adjustStock(c.id, 1)}>
                      <Plus size={13} />
                    </IconButton>
                  )}
                </span>
              </td>
              <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-3)" }}>
                {c.location || "—"}
              </td>
              <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-3)", whiteSpace: "normal" }}>
                {c.notes || "—"}
              </td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                {canEdit && (
                  <Button variant="ghost" size="sm" onClick={() => deleteConsumable(c.id)}>
                    <Trash2 size={14} />
                  </Button>
                )}
              </td>
            </HoverRow>
          ))}
        </tbody>
      </TableCard>

      <Dialog
        open={adding}
        onClose={() => setAdding(false)}
        title="Add consumable"
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setAdding(false) },
          { label: "Add", variant: "primary", onClick: submit },
        ]}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Name" span={2}>
            <Input value={form.name || ""} onChange={set("name")} placeholder="HP toner CF259X" autoFocus />
          </Field>
          <Field label="Type">
            <Select
              value={form.type || "other"}
              onChange={set("type")}
              style={{ width: "100%" }}
              options={Object.entries(CONSUMABLE_TYPES).map(([v, t]) => ({ value: v, label: t.label }))}
            />
          </Field>
          <Field label="Location">
            <Input value={form.location || ""} onChange={set("location")} placeholder="IT storage · shelf A" />
          </Field>
          <Field label="Stock">
            <Input type="number" value={form.stock || ""} onChange={set("stock")} />
          </Field>
          <Field label="Minimum">
            <Input type="number" value={form.min || ""} onChange={set("min")} />
          </Field>
          <Field label="Notes" span={2}>
            <Input value={form.notes || ""} onChange={set("notes")} />
          </Field>
        </div>
      </Dialog>
    </>
  );
}
