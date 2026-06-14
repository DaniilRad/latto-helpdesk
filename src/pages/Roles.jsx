import React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, ShieldCheck, GitBranch, Users2, Building2, X } from "lucide-react";
import { Button, Card, Switch, Dialog, Input, Select, Badge, Tabs, Avatar } from "../ds";
import { PageHeader, Eyebrow, Field, TableCard, thStyle, tdStyle, HoverRow } from "../components/bits.jsx";
import { ROLES, PERMISSIONS, RULE_TYPES } from "../lib/rbac.js";
import { useStore } from "../lib/store.jsx";

function ProfilesTab() {
  const { profiles, setProfilePerm, users, roleOf } = useStore();
  const membersOf = (role) => users.filter((u) => u.status !== "disabled" && roleOf(u).role === role);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
      {Object.entries(ROLES).map(([role, meta]) => {
        const members = membersOf(role);
        return (
          <Card key={role}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: meta.color, flex: "0 0 auto" }} />
              <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-1)" }}>{meta.label}</h3>
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
                {members.length} via rules
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--text-3)" }}>
              Assigned automatically by the AD rules — see the next tab.
            </p>
            <Eyebrow style={{ marginBottom: 6 }}>PERMISSIONS</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 14 }}>
              {PERMISSIONS.map((p, i) => (
                <div key={p.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "7px 0", borderBottom: i < PERMISSIONS.length - 1 ? "1px solid var(--border-faint)" : "none" }}>
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>{p.label}</span>
                  <Switch size="sm" checked={Boolean(profiles[role]?.[p.key])}
                    disabled={role === "admin"}
                    onChange={(v) => setProfilePerm(role, p.key, v)} />
                </div>
              ))}
            </div>
            {members.length > 0 && (
              <>
                <Eyebrow style={{ marginBottom: 8 }}>CURRENT MEMBERS</Eyebrow>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {members.slice(0, 5).map((m) => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={m.displayName} size={22} />
                      <span style={{ fontSize: 13, color: "var(--text-1)", flex: 1 }}>{m.displayName}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{m.sam}</span>
                    </div>
                  ))}
                  {members.length > 5 && (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
                      +{members.length - 5} more
                    </span>
                  )}
                </div>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function RulesTab() {
  const { rules, users, addRule, saveRule, deleteRule, moveRule, roleOf } = useStore();
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({ type: "group", value: "", role: "technician", note: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.value.trim()) return;
    addRule({ type: form.type, value: form.value.trim(), role: form.role, note: form.note.trim() });
    setAdding(false);
    setForm({ type: "group", value: "", role: "technician", note: "" });
  };

  const matchCount = (ruleId) =>
    users.filter((u) => u.status !== "disabled" && roleOf(u).ruleId === ruleId).length;
  const fallbackCount = users.filter((u) => u.status !== "disabled" && roleOf(u).ruleId === null).length;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-3)", flex: 1 }}>
          Rules run top-down — the first match wins. Evaluated at logon (JIT) and during nightly sync.
        </p>
        <Button size="sm" iconLeft={<Plus size={15} />} onClick={() => setAdding(true)}>Add rule</Button>
      </div>

      <TableCard>
        <thead><tr>
          <th style={thStyle}>#</th><th style={thStyle}>Condition</th><th style={thStyle}>Value</th>
          <th style={thStyle}>→ Role</th><th style={thStyle}>Matches</th><th style={thStyle}>Enabled</th>
          <th style={{ ...thStyle, textAlign: "right" }}>Order</th>
        </tr></thead>
        <tbody>
          {rules.map((r, i) => (
            <HoverRow key={r.id}>
              <td style={tdStyle}>{i + 1}</td>
              <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>
                {RULE_TYPES[r.type]?.label || r.type}
                {r.note && <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{r.note}</div>}
              </td>
              <td style={{ ...tdStyle, color: "var(--accent-text)" }}>{r.value}</td>
              <td style={tdStyle}>
                <Badge tone={r.role === "admin" ? "accent" : r.role === "external" ? "neutral" : "info"}>
                  {ROLES[r.role]?.label || r.role}
                </Badge>
              </td>
              <td style={tdStyle}>{matchCount(r.id)} users</td>
              <td style={tdStyle}>
                <Switch size="sm" checked={r.enabled} onChange={(v) => saveRule(r.id, { enabled: v })} />
              </td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <span style={{ display: "inline-flex", gap: 2 }}>
                  <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => moveRule(r.id, -1)}><ArrowUp size={14} /></Button>
                  <Button variant="ghost" size="sm" disabled={i === rules.length - 1} onClick={() => moveRule(r.id, 1)}><ArrowDown size={14} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteRule(r.id)}><Trash2 size={14} /></Button>
                </span>
              </td>
            </HoverRow>
          ))}
          <tr>
            <td style={tdStyle}>∞</td>
            <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-3)" }}>
              Fallback — authenticated but no rule matched
            </td>
            <td style={tdStyle}>—</td>
            <td style={tdStyle}><Badge tone="success">{ROLES["end-user"].label}</Badge></td>
            <td style={tdStyle}>{fallbackCount} users</td>
            <td style={tdStyle}><Badge tone="neutral">always</Badge></td>
            <td style={tdStyle} />
          </tr>
        </tbody>
      </TableCard>

      <Card style={{ marginTop: 18 }}>
        <Eyebrow style={{ marginBottom: 12 }}>LIVE PREVIEW · COMPUTED ROLES</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 }}>
          {users.filter((u) => u.status !== "disabled").map((u) => {
            const { role, ruleId } = roleOf(u);
            const rule = rules.find((r) => r.id === ruleId);
            return (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-faint)" }}>
                <Avatar name={u.displayName} size={26} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.displayName}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}>
                    {rule ? `rule: ${rule.value}` : "fallback"}
                  </div>
                </div>
                <Badge tone={role === "admin" ? "accent" : role === "supervisor" ? "warning" : role === "technician" ? "info" : role === "external" ? "neutral" : "success"}>
                  {ROLES[role].label}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      <Dialog open={adding} onClose={() => setAdding(false)} title="Add assignment rule"
        description="Maps an AD attribute to a system role. First match wins."
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setAdding(false) },
          { label: "Add rule", variant: "primary", onClick: submit },
        ]}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Condition">
            <Select value={form.type} onChange={set("type")} style={{ width: "100%" }}
              options={Object.entries(RULE_TYPES).map(([v, t]) => ({ value: v, label: t.label }))} />
          </Field>
          <Field label="Assign role">
            <Select value={form.role} onChange={set("role")} style={{ width: "100%" }}
              options={Object.entries(ROLES).map(([v, r]) => ({ value: v, label: r.label }))} />
          </Field>
          <Field label="Value" span={2}>
            <Input value={form.value} onChange={set("value")}
              placeholder={form.type === "attribute" ? "employeeType=External" : form.type === "ou" ? "OU=IT" : "IT-Support"} />
          </Field>
          <Field label="Note" span={2}>
            <Input value={form.note} onChange={set("note")} placeholder="Why this rule exists" />
          </Field>
        </div>
      </Dialog>
    </>
  );
}

function GroupsTab() {
  const { groups, users, allTickets, addGroup, saveGroup, deleteGroup, toast } = useStore();
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", description: "" });

  const submit = () => {
    if (!form.name.trim()) { toast("danger", "Name required", "Give the team a name."); return; }
    addGroup({ name: form.name.trim(), description: form.description.trim() });
    setAdding(false); setForm({ name: "", description: "" });
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-3)", flex: 1 }}>
          Resolver teams for routing tickets. A ticket can be routed to a team from its detail view.
        </p>
        <Button size="sm" iconLeft={<Plus size={15} />} onClick={() => setAdding(true)}>Add team</Button>
      </div>

      {groups.length === 0 && (
        <Card padding="28px" style={{ textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
          No resolver teams yet. Add one to start routing tickets.
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {groups.map((g) => {
          const members = users.filter((u) => g.members.includes(u.id));
          const candidates = users.filter((u) => u.status !== "disabled" && !g.members.includes(u.id));
          const routed = allTickets.filter((t) => t.groupId === g.id).length;
          return (
            <Card key={g.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <Users2 size={16} style={{ color: "var(--accent)" }} />
                <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-1)" }}>{g.name}</h3>
                <Button variant="ghost" size="sm" style={{ marginLeft: "auto", color: "var(--danger)" }}
                  onClick={() => deleteGroup(g.id)}><Trash2 size={14} /></Button>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--text-3)" }}>{g.description || "—"}</p>

              <Eyebrow style={{ marginBottom: 8 }}>MEMBERS · {members.length}</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                {members.length === 0 && <span style={{ fontSize: 13, color: "var(--text-3)" }}>No members yet.</span>}
                {members.map((m) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={m.displayName} size={22} />
                    <span style={{ fontSize: 13, color: "var(--text-1)", flex: 1 }}>{m.displayName}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{m.sam}</span>
                    <Button variant="ghost" size="sm" title="Remove"
                      onClick={() => saveGroup(g.id, { members: g.members.filter((id) => id !== m.id) })}><X size={13} /></Button>
                  </div>
                ))}
              </div>
              {candidates.length > 0 && (
                <Select size="sm" value="" style={{ width: "100%" }}
                  onChange={(e) => e.target.value && saveGroup(g.id, { members: [...g.members, e.target.value] })}
                  options={[{ value: "", label: "+ Add member…" },
                    ...candidates.map((u) => ({ value: u.id, label: `${u.displayName} · ${u.sam}` }))]} />
              )}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border-faint)",
                fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
                {routed} ticket{routed === 1 ? "" : "s"} routed here
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={adding} onClose={() => setAdding(false)} title="Add resolver team"
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setAdding(false) },
          { label: "Create", variant: "primary", onClick: submit },
        ]}>
        <div style={{ display: "grid", gap: 14 }}>
          <Field label="Team name" required><Input value={form.name} autoFocus
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Network team" /></Field>
          <Field label="Description"><Input value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What this team handles" /></Field>
        </div>
      </Dialog>
    </>
  );
}

function EntitiesTab() {
  const { entities, users, allDevices, allTickets, addEntity, saveEntity, deleteEntity, toast } = useStore();
  const [dialog, setDialog] = React.useState(null); // null | "new" | entity
  const [form, setForm] = React.useState({ name: "", description: "" });

  const openNew = () => { setForm({ name: "", description: "" }); setDialog("new"); };
  const openEdit = (e) => { setForm({ name: e.name, description: e.description || "" }); setDialog(e); };
  const submit = () => {
    if (!form.name.trim()) { toast("danger", "Name required", "Give the entity a name."); return; }
    if (dialog === "new") addEntity({ name: form.name.trim(), description: form.description.trim() });
    else saveEntity(dialog.id, { name: form.name.trim(), description: form.description.trim() });
    setDialog(null);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-3)", flex: 1 }}>
          Multi-tenancy boundaries. Staff can switch entities from the topbar; end-users and externals are hard-scoped to theirs.
        </p>
        <Button size="sm" iconLeft={<Plus size={15} />} onClick={openNew}>Add entity</Button>
      </div>

      <TableCard>
        <thead><tr>
          <th style={thStyle}>Entity</th><th style={thStyle}>Description</th>
          <th style={thStyle}>Users</th><th style={thStyle}>Devices</th><th style={thStyle}>Tickets</th>
          <th style={{ ...thStyle, textAlign: "right" }} />
        </tr></thead>
        <tbody>
          {entities.map((en) => {
            const u = users.filter((x) => (x.entityId || "e-hq") === en.id).length;
            const d = allDevices.filter((x) => (x.entityId || "e-hq") === en.id).length;
            const t = allTickets.filter((x) => (x.entityId || "e-hq") === en.id).length;
            return (
              <HoverRow key={en.id} onClick={() => openEdit(en)}>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-1)", fontWeight: 500 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Building2 size={15} style={{ color: "var(--accent)" }} />{en.name}
                  </span>
                </td>
                <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-3)", whiteSpace: "normal", maxWidth: 320 }}>
                  {en.description || "—"}
                </td>
                <td style={tdStyle}>{u}</td><td style={tdStyle}>{d}</td><td style={tdStyle}>{t}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {en.id !== "e-hq" && (
                    <Button variant="ghost" size="sm" style={{ color: "var(--danger)" }}
                      onClick={(ev) => { ev.stopPropagation(); deleteEntity(en.id); }}><Trash2 size={14} /></Button>
                  )}
                </td>
              </HoverRow>
            );
          })}
        </tbody>
      </TableCard>

      <Dialog open={dialog !== null} onClose={() => setDialog(null)}
        title={dialog === "new" ? "Add entity" : "Edit entity"}
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setDialog(null) },
          { label: dialog === "new" ? "Create" : "Save", variant: "primary", onClick: submit },
        ]}>
        <div style={{ display: "grid", gap: 14 }}>
          <Field label="Name" required><Input value={form.name} autoFocus
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Subsidiary North" /></Field>
          <Field label="Description"><Input value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></Field>
        </div>
      </Dialog>
    </>
  );
}

export function Roles() {
  const [tab, setTab] = React.useState("profiles");
  const TABS = {
    profiles: <ProfilesTab />, rules: <RulesTab />, groups: <GroupsTab />, entities: <EntitiesTab />,
  };
  return (
    <>
      <PageHeader eyebrow="ACCESS CONTROL" title="Roles, teams & org" />
      <Tabs value={tab} onChange={setTab} style={{ marginBottom: 18 }}
        tabs={[
          { value: "profiles", label: "Profiles & permissions", icon: <ShieldCheck size={15} /> },
          { value: "rules", label: "AD assignment rules", icon: <GitBranch size={15} /> },
          { value: "groups", label: "Teams", icon: <Users2 size={15} /> },
          { value: "entities", label: "Entities", icon: <Building2 size={15} /> },
        ]} />
      {TABS[tab]}
    </>
  );
}
