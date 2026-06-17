import { KeyRound, Package, Plus, Trash2 } from "lucide-react";
import React from "react";
import {
  Field,
  HoverRow,
  PageHeader,
  SortableTh,
  TableCard,
  TableEmptyRow,
  tdStyle,
  thStyle,
  useSort,
} from "../components/bits.jsx";
import { Badge, Button, Dialog, Input, Select, Tabs } from "../ds";
import { daysUntil, formatDate } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

function SoftwareTab() {
  const { software, devices, deleteSoftware, addSoftware, hasPerm, toast } = useStore();
  const canEdit = hasPerm("devices.write");
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const getters = React.useMemo(
    () => ({
      name: (s) => s.name,
      publisher: (s) => s.publisher,
      version: (s) => s.version,
      category: (s) => s.category,
      installs: (s) => (s.installs || []).length,
    }),
    [],
  );
  const sort = useSort(software, getters, "name", 1);

  const submit = () => {
    if (!form.name?.trim()) {
      toast("danger", "Name required", "Give the software a name.");
      return;
    }
    addSoftware({
      name: form.name.trim(),
      publisher: form.publisher || "",
      version: form.version || "",
      category: form.category || "Other",
    });
    setAdding(false);
    setForm({});
  };

  return (
    <>
      {canEdit && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Button size="sm" iconLeft={<Plus size={15} />} onClick={() => setAdding(true)}>
            Add software
          </Button>
        </div>
      )}
      <TableCard>
        <thead>
          <tr>
            <SortableTh k="name" sort={sort}>
              Name
            </SortableTh>
            <SortableTh k="publisher" sort={sort}>
              Publisher
            </SortableTh>
            <SortableTh k="version" sort={sort}>
              Version
            </SortableTh>
            <SortableTh k="category" sort={sort}>
              Category
            </SortableTh>
            <SortableTh k="installs" sort={sort}>
              Installs
            </SortableTh>
            {canEdit && <th style={{ ...thStyle, textAlign: "right" }} />}
          </tr>
        </thead>
        <tbody>
          {sort.sorted.length === 0 && (
            <TableEmptyRow colSpan={canEdit ? 6 : 5}>No software catalogued yet.</TableEmptyRow>
          )}
          {sort.sorted.map((s) => (
            <HoverRow key={s.id}>
              <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-1)", fontWeight: 500 }}>
                {s.name}
              </td>
              <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>{s.publisher}</td>
              <td style={tdStyle}>{s.version}</td>
              <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-3)" }}>{s.category}</td>
              <td style={tdStyle}>
                {(s.installs || []).length}
                <span style={{ color: "var(--text-3)" }}>
                  {" "}
                  ·{" "}
                  {(s.installs || [])
                    .slice(0, 3)
                    .map((id) => devices.find((d) => d.id === id)?.name)
                    .filter(Boolean)
                    .join(", ")}
                  {(s.installs || []).length > 3 ? "…" : ""}
                </span>
              </td>
              {canEdit && (
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <Button variant="ghost" size="sm" onClick={() => deleteSoftware(s.id)}>
                    <Trash2 size={14} />
                  </Button>
                </td>
              )}
            </HoverRow>
          ))}
        </tbody>
      </TableCard>

      <Dialog
        open={adding}
        onClose={() => setAdding(false)}
        title="Add software"
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setAdding(false) },
          { label: "Add", variant: "primary", onClick: submit },
        ]}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Name" span={2} required>
            <Input value={form.name || ""} onChange={set("name")} autoFocus />
          </Field>
          <Field label="Publisher">
            <Input value={form.publisher || ""} onChange={set("publisher")} />
          </Field>
          <Field label="Version">
            <Input value={form.version || ""} onChange={set("version")} />
          </Field>
          <Field label="Category" span={2}>
            <Input value={form.category || ""} onChange={set("category")} placeholder="Productivity" />
          </Field>
        </div>
      </Dialog>
    </>
  );
}

function LicensesTab() {
  const { licenses, software, addLicense, deleteLicense, hasPerm, toast } = useStore();
  const canEdit = hasPerm("devices.write");
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const getters = React.useMemo(
    () => ({
      name: (l) => l.name,
      software: (l) => software.find((s) => s.id === l.softwareId)?.name,
      key: (l) => l.key,
      seats: (l) => l.used / Math.max(1, l.seats),
      expires: (l) => l.expires,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [software],
  );
  const sort = useSort(licenses, getters, "name", 1);

  const submit = () => {
    if (!form.name?.trim() || !form.softwareId) {
      toast("danger", "Missing fields", "A license needs a name and a linked software.");
      return;
    }
    addLicense({
      name: form.name.trim(),
      softwareId: form.softwareId,
      key: form.key || "",
      seats: Number(form.seats) || 1,
      used: Number(form.used) || 0,
      expires: form.expires || "",
    });
    setAdding(false);
    setForm({});
  };

  return (
    <>
      {canEdit && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Button size="sm" iconLeft={<Plus size={15} />} onClick={() => setAdding(true)}>
            Add license
          </Button>
        </div>
      )}
      <TableCard>
        <thead>
          <tr>
            <SortableTh k="name" sort={sort}>
              License
            </SortableTh>
            <SortableTh k="software" sort={sort}>
              Software
            </SortableTh>
            <SortableTh k="key" sort={sort}>
              Key / tenant
            </SortableTh>
            <SortableTh k="seats" sort={sort}>
              Seats
            </SortableTh>
            <SortableTh k="expires" sort={sort}>
              Expires
            </SortableTh>
            {canEdit && <th style={{ ...thStyle, textAlign: "right" }} />}
          </tr>
        </thead>
        <tbody>
          {sort.sorted.length === 0 && (
            <TableEmptyRow colSpan={canEdit ? 6 : 5}>No licenses tracked yet.</TableEmptyRow>
          )}
          {sort.sorted.map((l) => {
            const sw = software.find((s) => s.id === l.softwareId);
            const days = daysUntil(l.expires);
            const seatTone = l.used >= l.seats ? "danger" : l.used / l.seats >= 0.85 ? "warning" : "success";
            return (
              <HoverRow key={l.id}>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-1)", fontWeight: 500 }}>
                  {l.name}
                </td>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>{sw?.name || "—"}</td>
                <td style={tdStyle}>{l.key || "—"}</td>
                <td style={tdStyle}>
                  <Badge tone={seatTone}>
                    {l.used}/{l.seats}
                  </Badge>
                </td>
                <td style={tdStyle}>
                  {l.expires ? (
                    <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                      {formatDate(l.expires)}
                      {days != null && days <= 60 && (
                        <Badge tone={days < 0 ? "danger" : "warning"}>{days < 0 ? "expired" : `${days}d`}</Badge>
                      )}
                    </span>
                  ) : (
                    "perpetual"
                  )}
                </td>
                {canEdit && (
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <Button variant="ghost" size="sm" onClick={() => deleteLicense(l.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </td>
                )}
              </HoverRow>
            );
          })}
        </tbody>
      </TableCard>

      <Dialog
        open={adding}
        onClose={() => setAdding(false)}
        title="Add license"
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setAdding(false) },
          { label: "Add", variant: "primary", onClick: submit },
        ]}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Name" span={2} required>
            <Input value={form.name || ""} onChange={set("name")} autoFocus />
          </Field>
          <Field label="Software" span={2} required>
            <Select
              value={form.softwareId || ""}
              onChange={set("softwareId")}
              style={{ width: "100%" }}
              options={[{ value: "", label: "— choose —" }, ...software.map((s) => ({ value: s.id, label: s.name }))]}
            />
          </Field>
          <Field label="Key / tenant">
            <Input value={form.key || ""} onChange={set("key")} />
          </Field>
          <Field label="Expires">
            <Input type="date" value={form.expires || ""} onChange={set("expires")} />
          </Field>
          <Field label="Seats">
            <Input type="number" value={form.seats || ""} onChange={set("seats")} />
          </Field>
          <Field label="Used">
            <Input type="number" value={form.used || ""} onChange={set("used")} />
          </Field>
        </div>
      </Dialog>
    </>
  );
}

export function Software() {
  const [tab, setTab] = React.useState("software");
  return (
    <>
      <PageHeader eyebrow="CMDB" title="Software & licenses" />
      <Tabs
        value={tab}
        onChange={setTab}
        style={{ marginBottom: 16 }}
        tabs={[
          { value: "software", label: "Software", icon: <Package size={15} /> },
          { value: "licenses", label: "Licenses", icon: <KeyRound size={15} /> },
        ]}
      />
      {tab === "software" ? <SoftwareTab /> : <LicensesTab />}
    </>
  );
}
