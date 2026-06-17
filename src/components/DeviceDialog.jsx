import React from "react";
import { Dialog, Input, Select } from "../ds";
import { DEVICE_STATUS, DEVICE_TYPES } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";
import { Field } from "./bits.jsx";

const EMPTY = {
  name: "",
  type: "pc",
  status: "in-stock",
  brand: "",
  model: "",
  serial: "",
  assignedTo: null,
  location: "",
  os: "",
  cpu: "",
  ram: "",
  ip: "",
  mac: "",
  purchaseDate: "",
  warrantyUntil: "",
  notes: "",
};

/** Add/edit device dialog. Pass `device` to edit, omit to create. */
export function DeviceDialog({ open, onClose, device }) {
  const { users, addDevice, saveDevice, toast } = useStore();
  const [form, setForm] = React.useState(EMPTY);
  const [attempted, setAttempted] = React.useState(false);
  const editing = Boolean(device);

  React.useEffect(() => {
    if (open) {
      setForm(device ? { ...EMPTY, ...device } : EMPTY);
      setAttempted(false);
    }
  }, [open, device]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));
  const nameMissing = !form.name.trim();

  const submit = () => {
    if (nameMissing) {
      setAttempted(true);
      toast("danger", "Name required", "A device needs a hostname or name.");
      return;
    }
    const payload = { ...form, assignedTo: form.assignedTo || null };
    if (editing) saveDevice(device.id, payload, payload.name);
    else addDevice(payload);
    onClose();
  };

  const userOptions = [
    { value: "", label: "— unassigned —" },
    ...users.filter((u) => u.status !== "disabled").map((u) => ({ value: u.id, label: `${u.displayName} (${u.sam})` })),
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={620}
      title={editing ? `Edit ${device?.name}` : "Add device"}
      description={editing ? undefined : "Track a new device in the inventory."}
      actions={[
        { label: "Cancel", variant: "ghost", onClick: onClose },
        { label: editing ? "Save" : "Add device", variant: "primary", onClick: submit },
      ]}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Hostname / name" required error={attempted && nameMissing ? "Name is required" : null}>
          <Input
            value={form.name}
            onChange={set("name")}
            placeholder="LT-NB-007"
            invalid={attempted && nameMissing}
            autoFocus
          />
        </Field>
        <Field label="Type">
          <Select
            value={form.type}
            onChange={set("type")}
            style={{ width: "100%" }}
            options={Object.entries(DEVICE_TYPES).map(([v, t]) => ({ value: v, label: t.label }))}
          />
        </Field>
        <Field label="Status">
          <Select
            value={form.status}
            onChange={set("status")}
            style={{ width: "100%" }}
            options={Object.entries(DEVICE_STATUS).map(([v, s]) => ({ value: v, label: s.label }))}
          />
        </Field>
        <Field label="Assigned to">
          <Select
            value={form.assignedTo || ""}
            onChange={set("assignedTo")}
            style={{ width: "100%" }}
            options={userOptions}
          />
        </Field>
        <Field label="Brand">
          <Input value={form.brand} onChange={set("brand")} placeholder="Lenovo" />
        </Field>
        <Field label="Model">
          <Input value={form.model} onChange={set("model")} placeholder="ThinkPad T14" />
        </Field>
        <Field label="Serial number">
          <Input value={form.serial} onChange={set("serial")} placeholder="SN…" />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={set("location")} placeholder="HQ · 2F · Finance" />
        </Field>
        <Field label="OS / firmware">
          <Input value={form.os} onChange={set("os")} placeholder="Windows 11 Pro" />
        </Field>
        <Field label="IP address">
          <Input value={form.ip} onChange={set("ip")} placeholder="10.0.x.x" />
        </Field>
        <Field label="Purchase date">
          <Input type="date" value={form.purchaseDate} onChange={set("purchaseDate")} />
        </Field>
        <Field label="Warranty until">
          <Input type="date" value={form.warrantyUntil} onChange={set("warrantyUntil")} />
        </Field>
        <Field label="Notes" span={2}>
          <Input value={form.notes} onChange={set("notes")} placeholder="Anything the next technician should know" />
        </Field>
      </div>
    </Dialog>
  );
}
