import React from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Globe, Database, Building2, Radar, Check, X, Network, ChevronRight, ChevronDown, Container } from "lucide-react";
import { Button, Badge, Tabs, Dialog, Input, Select, Tag, Card } from "../ds";
import { PageHeader, TableCard, HoverRow, thStyle, tdStyle, Field, EmptyState } from "../components/bits.jsx";
import { DEVICE_TYPES, formatDate, daysUntil, relTime } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

function AddDialog({ open, onClose, title, fields, onSubmit }) {
  const [form, setForm] = React.useState({});
  React.useEffect(() => { if (open) setForm({}); }, [open]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <Dialog open={open} onClose={onClose} title={title}
      actions={[
        { label: "Cancel", variant: "ghost", onClick: onClose },
        { label: "Add", variant: "primary", onClick: () => { if (onSubmit(form)) onClose(); } },
      ]}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {fields.map((f) => (
          <Field key={f.key} label={f.label} span={f.span || 1}>
            {f.options
              ? <Select value={form[f.key] || f.options[0].value} onChange={set(f.key)} style={{ width: "100%" }} options={f.options} />
              : <Input type={f.type || "text"} value={form[f.key] || ""} onChange={set(f.key)} placeholder={f.placeholder} />}
          </Field>
        ))}
      </div>
    </Dialog>
  );
}

function DomainsTab() {
  const { domains, addDomain, deleteDomain, hasPerm } = useStore();
  const canEdit = hasPerm("devices.write");
  const [adding, setAdding] = React.useState(false);
  return (
    <>
      {canEdit && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Button size="sm" iconLeft={<Plus size={15} />} onClick={() => setAdding(true)}>Add domain</Button>
      </div>}
      <TableCard>
        <thead><tr>
          <th style={thStyle}>Domain</th><th style={thStyle}>Registrar</th><th style={thStyle}>DNS</th>
          <th style={thStyle}>Expires</th><th style={thStyle}>Notes</th><th style={thStyle} />
        </tr></thead>
        <tbody>
          {domains.map((d) => {
            const days = daysUntil(d.expires);
            return (
              <HoverRow key={d.id}>
                <td style={{ ...tdStyle, color: "var(--text-1)" }}>{d.name}</td>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>{d.registrar}</td>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>{d.dns}</td>
                <td style={tdStyle}>
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    {formatDate(d.expires)}
                    {days != null && days <= 90 && <Badge tone={days <= 30 ? "danger" : "warning"}>{days}d</Badge>}
                  </span>
                </td>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-3)" }}>{d.notes || "—"}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {canEdit && <Button variant="ghost" size="sm" onClick={() => deleteDomain(d.id)}><Trash2 size={14} /></Button>}
                </td>
              </HoverRow>
            );
          })}
        </tbody>
      </TableCard>
      <AddDialog open={adding} onClose={() => setAdding(false)} title="Add domain"
        fields={[
          { key: "name", label: "Domain", span: 2, placeholder: "latto.io" },
          { key: "registrar", label: "Registrar" }, { key: "dns", label: "DNS provider" },
          { key: "expires", label: "Expires", type: "date" }, { key: "notes", label: "Notes" },
        ]}
        onSubmit={(f) => { if (!f.name?.trim()) return false; addDomain(f); return true; }} />
    </>
  );
}

function DatabasesTab() {
  const { databases, devices, addDatabase, deleteDatabase, hasPerm } = useStore();
  const canEdit = hasPerm("devices.write");
  const [adding, setAdding] = React.useState(false);
  return (
    <>
      {canEdit && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Button size="sm" iconLeft={<Plus size={15} />} onClick={() => setAdding(true)}>Add database</Button>
      </div>}
      <TableCard>
        <thead><tr>
          <th style={thStyle}>Instance</th><th style={thStyle}>Engine</th><th style={thStyle}>Host</th>
          <th style={thStyle}>Size</th><th style={thStyle}>Notes</th><th style={thStyle} />
        </tr></thead>
        <tbody>
          {databases.map((db) => {
            const host = devices.find((d) => d.id === db.assetId);
            return (
              <HoverRow key={db.id}>
                <td style={{ ...tdStyle, color: "var(--text-1)" }}>{db.name}</td>
                <td style={tdStyle}>{db.engine}</td>
                <td style={tdStyle}>
                  {host ? <Link to={`/devices/${host.id}`} style={{ color: "var(--accent-text)", textDecoration: "none" }}>{host.name}</Link> : "—"}
                </td>
                <td style={tdStyle}>{db.sizeGb} GB</td>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-3)" }}>{db.notes || "—"}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {canEdit && <Button variant="ghost" size="sm" onClick={() => deleteDatabase(db.id)}><Trash2 size={14} /></Button>}
                </td>
              </HoverRow>
            );
          })}
        </tbody>
      </TableCard>
      <AddDialog open={adding} onClose={() => setAdding(false)} title="Add database"
        fields={[
          { key: "name", label: "Instance name", span: 2 },
          { key: "engine", label: "Engine", placeholder: "PostgreSQL 16" },
          { key: "sizeGb", label: "Size (GB)", type: "number" },
          { key: "assetId", label: "Host server", span: 2,
            options: [{ value: "", label: "— none —" },
              ...devices.filter((d) => d.type === "server").map((d) => ({ value: d.id, label: d.name }))] },
          { key: "notes", label: "Notes", span: 2 },
        ]}
        onSubmit={(f) => { if (!f.name?.trim()) return false; addDatabase({ ...f, sizeGb: Number(f.sizeGb) || 0 }); return true; }} />
    </>
  );
}

function DatacentersTab() {
  const { datacenters, addDatacenter, deleteDatacenter, devices, hasPerm } = useStore();
  const canEdit = hasPerm("devices.write");
  const [adding, setAdding] = React.useState(false);
  return (
    <>
      {canEdit && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Button size="sm" iconLeft={<Plus size={15} />} onClick={() => setAdding(true)}>Add location</Button>
      </div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {datacenters.map((dc) => {
          const hosted = devices.filter((d) => d.location?.toLowerCase().includes("server room") && dc.name.toLowerCase().includes("server room"));
          return (
            <div key={dc.id} style={{ background: "var(--surface-1)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <Building2 size={16} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", flex: 1 }}>{dc.name}</span>
                {canEdit && <Button variant="ghost" size="sm" onClick={() => deleteDatacenter(dc.id)}><Trash2 size={14} /></Button>}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)", marginBottom: 10 }}>{dc.location}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {(dc.racks || []).map((r) => <Tag key={r}>{r}</Tag>)}
              </div>
              {hosted.length > 0 && (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
                  {hosted.length} devices in inventory here
                </div>
              )}
              {dc.notes && <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-2)" }}>{dc.notes}</p>}
            </div>
          );
        })}
      </div>
      <AddDialog open={adding} onClose={() => setAdding(false)} title="Add location"
        fields={[
          { key: "name", label: "Name", span: 2, placeholder: "HQ server room" },
          { key: "location", label: "Location", span: 2 },
          { key: "racksText", label: "Racks (comma-separated)", span: 2, placeholder: "RACK-01, RACK-02" },
          { key: "notes", label: "Notes", span: 2 },
        ]}
        onSubmit={(f) => {
          if (!f.name?.trim()) return false;
          addDatacenter({ name: f.name.trim(), location: f.location || "", notes: f.notes || "",
            racks: (f.racksText || "").split(",").map((r) => r.trim()).filter(Boolean) });
          return true;
        }} />
    </>
  );
}

function UnmanagedTab() {
  const { unmanaged, approveUnmanaged, dismissUnmanaged, hasPerm } = useStore();
  const canEdit = hasPerm("devices.write");
  const [approving, setApproving] = React.useState(null);
  const [type, setType] = React.useState("network");

  if (unmanaged.length === 0) {
    return <EmptyState icon={<Radar size={28} />} text="No unmanaged devices on the network. Everything's accounted for." />;
  }
  return (
    <>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-3)" }}>
        Discovered on the network but not in the inventory. Approve to start tracking, dismiss to ignore.
      </p>
      <TableCard>
        <thead><tr>
          <th style={thStyle}>Hostname</th><th style={thStyle}>IP</th><th style={thStyle}>MAC</th>
          <th style={thStyle}>Vendor</th><th style={thStyle}>Last seen</th><th style={thStyle} />
        </tr></thead>
        <tbody>
          {unmanaged.map((u) => (
            <HoverRow key={u.id}>
              <td style={{ ...tdStyle, color: "var(--text-1)" }}>{u.name}</td>
              <td style={tdStyle}>{u.ip}</td>
              <td style={tdStyle}>{u.mac}</td>
              <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>{u.vendor}</td>
              <td style={tdStyle}>{relTime(u.lastSeen)}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                {canEdit && (
                  <span style={{ display: "inline-flex", gap: 4 }}>
                    <Button variant="secondary" size="sm" iconLeft={<Check size={13} />} onClick={() => setApproving(u)}>Approve</Button>
                    <Button variant="ghost" size="sm" onClick={() => dismissUnmanaged(u.id)}><X size={14} /></Button>
                  </span>
                )}
              </td>
            </HoverRow>
          ))}
        </tbody>
      </TableCard>
      <Dialog open={Boolean(approving)} onClose={() => setApproving(null)}
        title={`Approve ${approving?.name}?`} description="It moves into the device inventory as in-stock."
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setApproving(null) },
          { label: "Approve", variant: "primary", onClick: () => { approveUnmanaged(approving.id, type); setApproving(null); } },
        ]}>
        <Field label="Device type">
          <Select value={type} onChange={(e) => setType(e.target.value)} style={{ width: "100%" }}
            options={[
              { value: "network", label: "Network" }, { value: "pc", label: "PC" },
              { value: "server", label: "Server" }, { value: "peripheral", label: "Peripheral" },
            ]} />
        </Field>
      </Dialog>
    </>
  );
}

/** Collapsible tree row. */
function TreeRow({ depth, icon, label, sub, badge, open, onToggle, accent }) {
  return (
    <div onClick={onToggle}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
        paddingLeft: 10 + depth * 22, cursor: onToggle ? "pointer" : "default",
        borderRadius: "var(--radius-sm)" }}
      onMouseEnter={(e) => { if (onToggle) e.currentTarget.style.background = "var(--surface-2)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
      {onToggle ? (open ? <ChevronDown size={14} style={{ color: "var(--text-3)" }} /> : <ChevronRight size={14} style={{ color: "var(--text-3)" }} />)
        : <span style={{ width: 14 }} />}
      {icon}
      <span style={{ fontSize: 13, color: accent ? "var(--text-1)" : "var(--text-2)", fontWeight: accent ? 600 : 400,
        fontFamily: accent ? "var(--font-sans)" : "var(--font-mono)" }}>{label}</span>
      {sub && <span style={{ fontSize: 12, color: "var(--text-3)" }}>{sub}</span>}
      {badge}
    </div>
  );
}

function TreeTab() {
  const { datacenters, allDevices } = useStore();
  const [open, setOpen] = React.useState(() => new Set(datacenters.map((d) => d.id)));
  const toggle = (key) => setOpen((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });

  // Mock placement: distribute infrastructure devices across locations → racks deterministically.
  const infra = allDevices.filter((d) => ["server", "network", "rack", "pdu"].includes(d.type));
  const placement = {}; // dcId -> rackName -> devices[]
  datacenters.forEach((dc) => { placement[dc.id] = {}; (dc.racks || ["—"]).forEach((r) => { placement[dc.id][r] = []; }); });
  infra.forEach((dev, i) => {
    const dc = datacenters[i % datacenters.length];
    const racks = dc.racks?.length ? dc.racks : ["—"];
    const rack = racks[Math.floor(i / datacenters.length) % racks.length];
    placement[dc.id][rack].push(dev);
  });

  return (
    <>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-3)" }}>
        Physical topology — location → rack → device. Demo placement; rack assignment is illustrative.
      </p>
      <Card padding="8px">
        {datacenters.map((dc) => {
          const dcOpen = open.has(dc.id);
          const count = Object.values(placement[dc.id]).reduce((a, r) => a + r.length, 0);
          return (
            <div key={dc.id}>
              <TreeRow depth={0} accent open={dcOpen} onToggle={() => toggle(dc.id)}
                icon={<Building2 size={15} style={{ color: "var(--accent)" }} />}
                label={dc.name} sub={dc.location}
                badge={<Badge tone="neutral" style={{ marginLeft: "auto" }}>{count} devices</Badge>} />
              {dcOpen && (dc.racks?.length ? dc.racks : ["—"]).map((rack) => {
                const rackKey = `${dc.id}:${rack}`;
                const rackOpen = open.has(rackKey);
                const devs = placement[dc.id][rack] || [];
                return (
                  <div key={rackKey}>
                    <TreeRow depth={1} open={rackOpen} onToggle={() => toggle(rackKey)}
                      icon={<Container size={15} style={{ color: "var(--text-2)" }} />}
                      label={rack} badge={<Badge tone="neutral" style={{ marginLeft: "auto" }}>{devs.length}</Badge>} />
                    {rackOpen && devs.map((dev) => {
                      const T = (DEVICE_TYPES[dev.type] || DEVICE_TYPES.peripheral);
                      return (
                        <Link key={dev.id} to={`/devices/${dev.id}`} style={{ textDecoration: "none", display: "block" }}>
                          <TreeRow depth={2}
                            icon={<T.icon size={14} style={{ color: T.color }} />}
                            label={dev.name} sub={`${dev.brand} ${dev.model}`} />
                        </Link>
                      );
                    })}
                    {rackOpen && devs.length === 0 && (
                      <div style={{ paddingLeft: 10 + 2 * 22, padding: "6px 10px 6px 54px", fontSize: 12, color: "var(--text-3)" }}>
                        empty
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </Card>
    </>
  );
}

export function Infrastructure() {
  const [tab, setTab] = React.useState("domains");
  const { unmanaged } = useStore();
  return (
    <>
      <PageHeader eyebrow="INVENTORY" title="Infrastructure" />
      <Tabs value={tab} onChange={setTab} style={{ marginBottom: 16 }}
        tabs={[
          { value: "domains", label: "Domains", icon: <Globe size={15} /> },
          { value: "databases", label: "Databases", icon: <Database size={15} /> },
          { value: "datacenters", label: "Locations & racks", icon: <Building2 size={15} /> },
          { value: "tree", label: "Tree view", icon: <Network size={15} /> },
          { value: "unmanaged", label: `Unmanaged${unmanaged.length ? ` (${unmanaged.length})` : ""}`, icon: <Radar size={15} /> },
        ]} />
      {tab === "domains" && <DomainsTab />}
      {tab === "databases" && <DatabasesTab />}
      {tab === "datacenters" && <DatacentersTab />}
      {tab === "tree" && <TreeTab />}
      {tab === "unmanaged" && <UnmanagedTab />}
    </>
  );
}
