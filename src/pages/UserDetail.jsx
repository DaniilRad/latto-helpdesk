import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eyebrow, PageHeader } from "../components/bits.jsx";
import { UserDialog } from "../components/UserDialog.jsx";
import { Avatar, Badge, Button, Card, Dialog, Tag } from "../ds";
import { DEVICE_STATUS, DEVICE_TYPES, formatDate, relTime, USER_STATUS } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

function Row({ label, children, mono = true }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--border-faint)" }}>
      <span
        style={{
          width: 150,
          flex: "0 0 auto",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
          fontSize: 13,
          color: "var(--text-1)",
          minWidth: 0,
          overflowWrap: "anywhere",
        }}
      >
        {children || "—"}
      </span>
    </div>
  );
}

export function UserDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { users, devices, deleteUser } = useStore();
  const [editing, setEditing] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  const user = users.find((u) => u.id === id);
  if (!user) {
    return (
      <>
        <Button variant="ghost" size="sm" iconLeft={<ArrowLeft size={15} />} onClick={() => nav("/users")}>
          AD users
        </Button>
        <p style={{ color: "var(--text-2)" }}>This user doesn't exist anymore.</p>
      </>
    );
  }

  const s = USER_STATUS[user.status] || USER_STATUS.enabled;
  const owned = devices.filter((d) => d.assignedTo === user.id);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        iconLeft={<ArrowLeft size={15} />}
        onClick={() => nav("/users")}
        style={{ marginBottom: 10 }}
      >
        AD users
      </Button>

      <PageHeader
        eyebrow={`${user.department?.toUpperCase() || "AD"} · ${user.sam}`}
        title={user.displayName}
        actions={
          <>
            <Button variant="secondary" iconLeft={<Pencil size={15} />} onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button variant="danger" iconLeft={<Trash2 size={15} />} onClick={() => setConfirming(true)}>
              Remove
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
          <Badge tone={s.tone} dot pulse={user.status === "locked"}>
            {s.label}
          </Badge>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>
            last logon {relTime(user.lastLogon)}
          </span>
        </div>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 18, alignItems: "start" }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <Avatar
              name={user.displayName}
              size={52}
              status={user.status === "enabled" ? "online" : user.status === "locked" ? "busy" : "offline"}
            />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>{user.displayName}</div>
              <div style={{ fontSize: 13, color: "var(--text-3)" }}>{user.title || "—"}</div>
            </div>
          </div>
          <Row label="sAMAccountName">{user.sam}</Row>
          <Row label="Email">{user.email}</Row>
          <Row label="Phone">{user.phone}</Row>
          <Row label="Department" mono={false}>
            {user.department}
          </Row>
          <Row label="OU">{user.ou}</Row>
          <Row label="Last logon">{formatDate(user.lastLogon)}</Row>
          {user.groups?.length > 0 && (
            <>
              <Eyebrow style={{ margin: "16px 0 10px" }}>AD GROUPS</Eyebrow>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {user.groups.map((g) => (
                  <Tag key={g}>{g}</Tag>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card padding="0">
          <div style={{ padding: "16px 18px 10px" }}>
            <Eyebrow>ASSIGNED DEVICES · {owned.length}</Eyebrow>
          </div>
          {owned.length === 0 ? (
            <p style={{ padding: "0 18px 18px", margin: 0, color: "var(--text-3)", fontSize: 13 }}>
              Nothing issued to this user yet.
            </p>
          ) : (
            owned.map((d, i) => {
              const t = DEVICE_TYPES[d.type] || DEVICE_TYPES.peripheral;
              const ds = DEVICE_STATUS[d.status] || DEVICE_STATUS["in-stock"];
              return (
                <Link key={d.id} to={`/devices/${d.id}`} style={{ textDecoration: "none" }}>
                  <div
                    className="latto-rowhover"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 18px",
                      borderTop: i === 0 ? "none" : "1px solid var(--border-faint)",
                    }}
                  >
                    <t.icon size={16} style={{ color: t.color, flex: "0 0 auto" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-1)", width: 110 }}>
                      {d.name}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-3)",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.brand} {d.model}
                    </span>
                    <Badge tone={ds.tone}>{ds.label}</Badge>
                  </div>
                </Link>
              );
            })
          )}
        </Card>
      </div>

      <UserDialog open={editing} onClose={() => setEditing(false)} user={user} />
      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title={`Remove ${user.displayName}?`}
        description={
          owned.length > 0
            ? `${owned.length} assigned device(s) will become unassigned. This can't be undone.`
            : "This can't be undone."
        }
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setConfirming(false) },
          {
            label: "Remove",
            variant: "danger",
            onClick: () => {
              deleteUser(user.id);
              nav("/users");
            },
          },
        ]}
      />
    </>
  );
}
