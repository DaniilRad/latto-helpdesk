import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eyebrow, PageHeader } from "../components/bits.jsx";
import { DeviceDialog } from "../components/DeviceDialog.jsx";
import { PriorityBadge, StatusBadge } from "../components/ticketBits.jsx";
import { Avatar, Badge, Button, Card, Dialog } from "../ds";
import { DEVICE_STATUS, DEVICE_TYPES, daysUntil, formatDate, relTime } from "../lib/meta.js";
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

export function DeviceDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { devices, users, tickets, deleteDevice } = useStore();
  const [editing, setEditing] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  const device = devices.find((d) => d.id === id);
  if (!device) {
    return (
      <>
        <Button variant="ghost" size="sm" iconLeft={<ArrowLeft size={15} />} onClick={() => nav("/devices")}>
          Devices
        </Button>
        <p style={{ color: "var(--text-2)" }}>This device doesn't exist anymore.</p>
      </>
    );
  }

  const t = DEVICE_TYPES[device.type] || DEVICE_TYPES.peripheral;
  const s = DEVICE_STATUS[device.status] || DEVICE_STATUS["in-stock"];
  const owner = users.find((u) => u.id === device.assignedTo);
  const wDays = daysUntil(device.warrantyUntil);
  const incidents = tickets
    .filter((t) => t.assetId === device.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        iconLeft={<ArrowLeft size={15} />}
        onClick={() => nav("/devices")}
        style={{ marginBottom: 10 }}
      >
        Devices
      </Button>

      <PageHeader
        eyebrow={`${t.label.toUpperCase()} · ${device.serial || "NO SERIAL"}`}
        title={device.name}
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
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Badge tone={s.tone} dot pulse={device.status === "repair"}>
            {s.label}
          </Badge>
          {wDays != null && wDays < 0 && <Badge tone="danger">warranty expired</Badge>}
          {wDays != null && wDays >= 0 && wDays <= 90 && <Badge tone="warning">warranty {wDays}d left</Badge>}
        </div>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, alignItems: "start" }}>
        <Card>
          <Eyebrow style={{ marginBottom: 6 }}>HARDWARE</Eyebrow>
          <Row label="Brand · model" mono={false}>
            {[device.brand, device.model].filter(Boolean).join(" ")}
          </Row>
          <Row label="Serial">{device.serial}</Row>
          <Row label="OS / firmware">{device.os}</Row>
          {device.cpu && <Row label="CPU">{device.cpu}</Row>}
          {device.ram && <Row label="RAM">{device.ram}</Row>}
          <Row label="IP">{device.ip}</Row>
          <Row label="MAC">{device.mac}</Row>
          <Eyebrow style={{ margin: "18px 0 6px" }}>LIFECYCLE</Eyebrow>
          <Row label="Purchased">{formatDate(device.purchaseDate)}</Row>
          <Row label="Warranty until">{formatDate(device.warrantyUntil)}</Row>
          <Row label="Location" mono={false}>
            {device.location}
          </Row>
          {device.notes && (
            <>
              <Eyebrow style={{ margin: "18px 0 6px" }}>NOTES</Eyebrow>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-2)", lineHeight: 1.55 }}>{device.notes}</p>
            </>
          )}
        </Card>

        <Card>
          <Eyebrow style={{ marginBottom: 12 }}>ASSIGNED TO</Eyebrow>
          {owner ? (
            <Link to={`/users/${owner.id}`} style={{ textDecoration: "none" }}>
              <div
                className="latto-rowhover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 10,
                  margin: -10,
                  borderRadius: "var(--radius-md)",
                }}
              >
                <Avatar name={owner.displayName} size={40} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)" }}>{owner.displayName}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>
                    {owner.sam} · {owner.department}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-3)" }}>
              Unassigned. Edit the device to issue it to someone.
            </p>
          )}

          <Eyebrow style={{ margin: "20px 0 4px" }}>INCIDENT HISTORY · {incidents.length}</Eyebrow>
          {incidents.length === 0 ? (
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-3)" }}>
              No tickets ever touched this device. A quiet one.
            </p>
          ) : (
            incidents.map((t) => (
              <Link key={t.id} to={`/tickets/${t.id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border-faint)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--accent-text)",
                      flex: "0 0 auto",
                    }}
                  >
                    {t.number}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--text-1)",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.title}
                  </span>
                  <StatusBadge status={t.status} />
                </div>
                <div style={{ display: "flex", gap: 8, padding: "4px 0 6px", alignItems: "center" }}>
                  <PriorityBadge priority={t.priority} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
                    opened {relTime(t.createdAt)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </Card>
      </div>

      <DeviceDialog open={editing} onClose={() => setEditing(false)} device={device} />
      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title={`Remove ${device.name}?`}
        description="This can't be undone."
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setConfirming(false) },
          {
            label: "Remove",
            variant: "danger",
            onClick: () => {
              deleteDevice(device.id);
              nav("/devices");
            },
          },
        ]}
      />
    </>
  );
}
