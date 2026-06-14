import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, PackageOpen } from "lucide-react";
import { Button, Input, Select, Badge } from "../ds";
import { PageHeader, TableCard, HoverRow, tdStyle, EmptyState, SortableTh, useSort } from "../components/bits.jsx";
import { DeviceDialog } from "../components/DeviceDialog.jsx";
import { DEVICE_TYPES, DEVICE_STATUS } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

export function Devices() {
  const { devices, users } = useStore();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = React.useState(params.get("q") || "");
  const [type, setType] = React.useState(params.get("type") || "all");
  const [status, setStatus] = React.useState("all");
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => {
    const pq = params.get("q");
    if (pq != null) setQ(pq);
    const pt = params.get("type");
    if (pt != null) setType(pt);
  }, [params]);

  const userName = (id) => users.find((u) => u.id === id)?.displayName || null;

  const needle = q.trim().toLowerCase();
  const filtered = devices.filter((d) => {
    if (type !== "all" && d.type !== type) return false;
    if (status !== "all" && d.status !== status) return false;
    if (!needle) return true;
    const hay = [d.name, d.brand, d.model, d.serial, d.location, d.os, d.ip, d.mac, userName(d.assignedTo) || ""]
      .join(" ").toLowerCase();
    return hay.includes(needle);
  });

  const getters = React.useMemo(() => ({
    name: (d) => d.name,
    type: (d) => DEVICE_TYPES[d.type]?.label || d.type,
    status: (d) => DEVICE_STATUS[d.status]?.label || d.status,
    model: (d) => `${d.brand} ${d.model}`,
    serial: (d) => d.serial,
    assigned: (d) => userName(d.assignedTo),
    location: (d) => d.location,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [users]);
  const sort = useSort(filtered, getters, "name", 1);

  const clearParamsOn = (fn) => (v) => { fn(v); if (params.toString()) setParams({}, { replace: true }); };

  return (
    <>
      <PageHeader eyebrow="INVENTORY" title="Devices"
        actions={<Button iconLeft={<Plus size={16} />} onClick={() => setAdding(true)}>Add device</Button>} />

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <Input placeholder="Search name, serial, model, user…" aria-label="Search devices" icon={<Search size={16} />}
          value={q} onChange={(e) => clearParamsOn(setQ)(e.target.value)} wrapStyle={{ width: 290 }} />
        <Select value={type} onChange={(e) => clearParamsOn(setType)(e.target.value)} style={{ width: 160 }} aria-label="Filter by type"
          options={[{ value: "all", label: "All types" },
            ...Object.entries(DEVICE_TYPES).map(([v, t]) => ({ value: v, label: t.label }))]} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 160 }} aria-label="Filter by status"
          options={[{ value: "all", label: "All statuses" },
            ...Object.entries(DEVICE_STATUS).map(([v, s]) => ({ value: v, label: s.label }))]} />
        <span style={{ alignSelf: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>
          {filtered.length} of {devices.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<PackageOpen size={28} />} text="No devices match. Adjust the filters or add one."
          action={<Button size="sm" variant="secondary" onClick={() => setAdding(true)}>Add device</Button>} />
      ) : (
        <TableCard>
          <thead><tr>
            <SortableTh k="name" sort={sort}>Name</SortableTh>
            <SortableTh k="type" sort={sort}>Type</SortableTh>
            <SortableTh k="status" sort={sort}>Status</SortableTh>
            <SortableTh k="model" sort={sort}>Model</SortableTh>
            <SortableTh k="serial" sort={sort}>Serial</SortableTh>
            <SortableTh k="assigned" sort={sort}>Assigned to</SortableTh>
            <SortableTh k="location" sort={sort}>Location</SortableTh>
          </tr></thead>
          <tbody>
            {sort.sorted.map((d) => {
              const t = DEVICE_TYPES[d.type] || DEVICE_TYPES.peripheral;
              const s = DEVICE_STATUS[d.status] || DEVICE_STATUS["in-stock"];
              return (
                <HoverRow key={d.id} onClick={() => nav(`/devices/${d.id}`)}>
                  <td style={{ ...tdStyle, color: "var(--text-1)" }}>{d.name}</td>
                  <td style={tdStyle}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                      <t.icon size={14} style={{ color: t.color }} />{t.label}
                    </span>
                  </td>
                  <td style={tdStyle}><Badge tone={s.tone} dot pulse={d.status === "repair"}>{s.label}</Badge></td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>{d.brand} {d.model}</td>
                  <td style={tdStyle}>{d.serial || "—"}</td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: d.assignedTo ? "var(--text-1)" : "var(--text-3)" }}>
                    {userName(d.assignedTo) || "—"}
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-3)" }}>{d.location || "—"}</td>
                </HoverRow>
              );
            })}
          </tbody>
        </TableCard>
      )}

      <DeviceDialog open={adding} onClose={() => setAdding(false)} />
    </>
  );
}
