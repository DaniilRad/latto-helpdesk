import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, UserX } from "lucide-react";
import { Button, Input, Select, Badge, Avatar } from "../ds";
import { PageHeader, TableCard, HoverRow, tdStyle, EmptyState, SortableTh, useSort } from "../components/bits.jsx";
import { UserDialog } from "../components/UserDialog.jsx";
import { USER_STATUS, relTime } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

export function UsersPage() {
  const { users, devices } = useStore();
  const nav = useNavigate();
  const [q, setQ] = React.useState("");
  const [dept, setDept] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [adding, setAdding] = React.useState(false);

  const departments = [...new Set(users.map((u) => u.department).filter(Boolean))].sort();
  const deviceCount = (id) => devices.filter((d) => d.assignedTo === id).length;

  const needle = q.trim().toLowerCase();
  const filtered = users.filter((u) => {
    if (dept !== "all" && u.department !== dept) return false;
    if (status !== "all" && u.status !== status) return false;
    if (!needle) return true;
    return [u.displayName, u.sam, u.email, u.title, u.department].join(" ").toLowerCase().includes(needle);
  });

  const getters = React.useMemo(() => ({
    name: (u) => u.displayName,
    account: (u) => u.sam,
    department: (u) => u.department,
    title: (u) => u.title,
    status: (u) => USER_STATUS[u.status]?.label || u.status,
    devices: (u) => deviceCount(u.id),
    logon: (u) => u.lastLogon,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [devices]);
  const sort = useSort(filtered, getters, "name", 1);

  return (
    <>
      <PageHeader eyebrow="ACTIVE DIRECTORY" title="AD users"
        actions={<Button iconLeft={<Plus size={16} />} onClick={() => setAdding(true)}>Add user</Button>} />

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <Input placeholder="Search name, sam, email…" icon={<Search size={16} />}
          value={q} onChange={(e) => setQ(e.target.value)} wrapStyle={{ width: 270 }} />
        <Select value={dept} onChange={(e) => setDept(e.target.value)} style={{ width: 170 }}
          options={[{ value: "all", label: "All departments" },
            ...departments.map((d) => ({ value: d, label: d }))]} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 150 }}
          options={[{ value: "all", label: "All statuses" },
            ...Object.entries(USER_STATUS).map(([v, s]) => ({ value: v, label: s.label }))]} />
        <span style={{ alignSelf: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>
          {filtered.length} of {users.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<UserX size={28} />} text="No users match. Adjust the filters or add one."
          action={<Button size="sm" variant="secondary" onClick={() => setAdding(true)}>Add user</Button>} />
      ) : (
        <TableCard>
          <thead><tr>
            <SortableTh k="name" sort={sort}>User</SortableTh>
            <SortableTh k="account" sort={sort}>Account</SortableTh>
            <SortableTh k="department" sort={sort}>Department</SortableTh>
            <SortableTh k="title" sort={sort}>Title</SortableTh>
            <SortableTh k="status" sort={sort}>Status</SortableTh>
            <SortableTh k="devices" sort={sort}>Devices</SortableTh>
            <SortableTh k="logon" sort={sort} align="right">Last logon</SortableTh>
          </tr></thead>
          <tbody>
            {sort.sorted.map((u) => {
              const s = USER_STATUS[u.status] || USER_STATUS.enabled;
              return (
                <HoverRow key={u.id} onClick={() => nav(`/users/${u.id}`)}>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={u.displayName} size={26} />
                      <span style={{ color: "var(--text-1)", fontWeight: 500 }}>{u.displayName}</span>
                    </span>
                  </td>
                  <td style={tdStyle}>{u.sam}</td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-sans)" }}>{u.department || "—"}</td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-3)" }}>{u.title || "—"}</td>
                  <td style={tdStyle}><Badge tone={s.tone} dot pulse={u.status === "locked"}>{s.label}</Badge></td>
                  <td style={tdStyle}>{deviceCount(u.id) || "—"}</td>
                  <td style={{ ...tdStyle, textAlign: "right", color: "var(--text-3)" }}>{relTime(u.lastLogon)}</td>
                </HoverRow>
              );
            })}
          </tbody>
        </TableCard>
      )}

      <UserDialog open={adding} onClose={() => setAdding(false)} />
    </>
  );
}
