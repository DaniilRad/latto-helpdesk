import React from "react";
import { Dialog, Input, Select } from "../ds";
import { Field } from "./bits.jsx";
import { USER_STATUS } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

const EMPTY = {
  displayName: "", sam: "", email: "", department: "", title: "", phone: "",
  status: "enabled", lastLogon: "", ou: "", groups: [],
};

/** Add/edit AD user dialog. Pass `user` to edit, omit to create. */
export function UserDialog({ open, onClose, user }) {
  const { addUser, saveUser, toast } = useStore();
  const [form, setForm] = React.useState(EMPTY);
  const [groupsText, setGroupsText] = React.useState("");
  const [attempted, setAttempted] = React.useState(false);
  const editing = Boolean(user);

  React.useEffect(() => {
    if (open) {
      setForm(user ? { ...EMPTY, ...user } : EMPTY);
      setGroupsText(user ? (user.groups || []).join(", ") : "Domain Users");
      setAttempted(false);
    }
  }, [open, user]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const nameMissing = !form.displayName.trim();
  const samMissing = !form.sam.trim();

  const submit = () => {
    if (nameMissing || samMissing) {
      setAttempted(true);
      toast("danger", "Missing fields", "Display name and sAMAccountName are both required.");
      return;
    }
    const payload = {
      ...form,
      groups: groupsText.split(",").map((g) => g.trim()).filter(Boolean),
    };
    if (editing) saveUser(user.id, payload, payload.sam);
    else addUser(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} width={620}
      title={editing ? `Edit ${user?.sam}` : "Add AD user"}
      description={editing ? undefined : "Track an Active Directory account."}
      actions={[
        { label: "Cancel", variant: "ghost", onClick: onClose },
        { label: editing ? "Save" : "Add user", variant: "primary", onClick: submit },
      ]}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Display name" required
          error={attempted && nameMissing ? "Display name is required" : null}>
          <Input value={form.displayName} onChange={set("displayName")} placeholder="Anna Koval"
            invalid={attempted && nameMissing} autoFocus />
        </Field>
        <Field label="sAMAccountName" required
          error={attempted && samMissing ? "Account name is required" : null}>
          <Input value={form.sam} onChange={set("sam")} placeholder="a.koval" invalid={attempted && samMissing} />
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={set("email")} placeholder="a.koval@latto.io" />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={set("phone")} placeholder="+372 …" />
        </Field>
        <Field label="Department">
          <Input value={form.department} onChange={set("department")} placeholder="Finance" />
        </Field>
        <Field label="Job title">
          <Input value={form.title} onChange={set("title")} placeholder="Accountant" />
        </Field>
        <Field label="Account status">
          <Select value={form.status} onChange={set("status")} style={{ width: "100%" }}
            options={Object.entries(USER_STATUS).map(([v, s]) => ({ value: v, label: s.label }))} />
        </Field>
        <Field label="Organizational unit">
          <Input value={form.ou} onChange={set("ou")} placeholder="OU=Finance,DC=latto,DC=io" />
        </Field>
        <Field label="AD groups (comma-separated)" span={2}>
          <Input value={groupsText} onChange={(e) => setGroupsText(e.target.value)}
            placeholder="Domain Users, Finance, VPN Users" />
        </Field>
      </div>
    </Dialog>
  );
}
