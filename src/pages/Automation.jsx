import React from "react";
import {
  Mail, Clock, Rss, Plus, Trash2, Bell, CheckCircle2, AlertTriangle,
  RefreshCw, Inbox, ShieldAlert, ExternalLink,
} from "lucide-react";
import { Button, Card, Badge, Switch, Tabs, Dialog, Input, Select } from "../ds";
import { PageHeader, Eyebrow, TableCard, HoverRow, thStyle, tdStyle, Field } from "../components/bits.jsx";
import { relTime } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

const DEMO = (
  <Badge tone="warning" style={{ marginLeft: 8 }}>demo</Badge>
);

/* ------------------------------------------------ Mail receivers ------------------------------------------------ */

const SEED_RECEIVERS = [
  { id: "r1", address: "support@latto.io", protocol: "IMAP", auth: "OAuth · Microsoft 365",
    status: "connected", lastPoll: "2026-06-14T08:55:00Z", folder: "INBOX", created: 412 },
  { id: "r2", address: "helpdesk@latto.io", protocol: "IMAP", auth: "OAuth · Microsoft 365",
    status: "connected", lastPoll: "2026-06-14T08:54:00Z", folder: "INBOX", created: 1180 },
  { id: "r3", address: "noreply-scan@latto.io", protocol: "POP3", auth: "Password",
    status: "error", lastPoll: "2026-06-14T06:10:00Z", folder: "INBOX", created: 0 },
];

function MailReceiversTab() {
  const { toast } = useStore();
  const [receivers, setReceivers] = React.useState(SEED_RECEIVERS);
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({ protocol: "IMAP", auth: "oauth-m365" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const statusTone = { connected: "success", error: "danger", paused: "neutral" };
  const oauth = (provider) =>
    toast("accent", `${provider} sign-in`, "Demo only — no real OAuth flow is wired up yet.");

  const submit = () => {
    if (!form.address?.trim()) return;
    setReceivers((r) => [{
      id: Math.random().toString(36).slice(2, 7), address: form.address.trim(),
      protocol: form.protocol, auth: form.auth === "oauth-m365" ? "OAuth · Microsoft 365"
        : form.auth === "oauth-google" ? "OAuth · Google" : "Password",
      status: "paused", lastPoll: null, folder: form.folder || "INBOX", created: 0,
    }, ...r]);
    setAdding(false); setForm({ protocol: "IMAP", auth: "oauth-m365" });
    toast("success", "Receiver added", `${form.address} will poll once activated.`);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-3)", flex: 1 }}>
          Mailboxes polled to open tickets from incoming e-mail (Email-to-Ticket). OAuth for Microsoft 365 / Google.
        </p>
        <Button size="sm" iconLeft={<Plus size={15} />} onClick={() => setAdding(true)}>Add receiver</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {receivers.map((r) => (
          <Card key={r.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Mail size={16} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", flex: 1, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.address}</span>
              <Badge tone={statusTone[r.status]} dot pulse={r.status === "error"}>{r.status}</Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px",
              fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)", marginBottom: 12 }}>
              <span>protocol</span><span style={{ color: "var(--text-2)" }}>{r.protocol} · {r.folder}</span>
              <span>auth</span><span style={{ color: "var(--text-2)" }}>{r.auth}</span>
              <span>last poll</span><span style={{ color: "var(--text-2)" }}>{r.lastPoll ? relTime(r.lastPoll) : "never"}</span>
              <span>tickets</span><span style={{ color: "var(--text-2)" }}>{r.created} created</span>
            </div>
            {r.status === "error" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 10,
                background: "var(--danger-soft, color-mix(in srgb, var(--danger) 12%, transparent))",
                border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)", borderRadius: "var(--radius-md)",
                fontSize: 12, color: "var(--danger)" }}>
                <AlertTriangle size={14} /> Authentication failed — token expired.
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary" size="sm" iconLeft={<RefreshCw size={13} />}
                onClick={() => toast("neutral", "Polling…", `Demo: pretending to fetch ${r.address}.`)}>Poll now</Button>
              <Button variant="ghost" size="sm" style={{ marginLeft: "auto", color: "var(--danger)" }}
                onClick={() => setReceivers((rs) => rs.filter((x) => x.id !== r.id))}><Trash2 size={14} /></Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={adding} onClose={() => setAdding(false)} title="Add mail receiver"
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setAdding(false) },
          { label: "Add", variant: "primary", onClick: submit },
        ]}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Mailbox address" span={2}>
            <Input value={form.address || ""} onChange={set("address")} autoFocus placeholder="support@latto.io" />
          </Field>
          <Field label="Protocol">
            <Select value={form.protocol} onChange={set("protocol")} style={{ width: "100%" }}
              options={[{ value: "IMAP", label: "IMAP" }, { value: "POP3", label: "POP3" }]} />
          </Field>
          <Field label="Folder">
            <Input value={form.folder || ""} onChange={set("folder")} placeholder="INBOX" />
          </Field>
          <Field label="Authentication" span={2}>
            <Select value={form.auth} onChange={set("auth")} style={{ width: "100%" }}
              options={[{ value: "oauth-m365", label: "OAuth · Microsoft 365" },
                { value: "oauth-google", label: "OAuth · Google Workspace" },
                { value: "password", label: "Password (basic)" }]} />
          </Field>
          {form.auth?.startsWith("oauth") && (
            <div style={{ gridColumn: "span 2", display: "flex", gap: 8 }}>
              <Button variant="secondary" size="sm" iconLeft={<ExternalLink size={13} />}
                onClick={() => oauth(form.auth === "oauth-google" ? "Google" : "Microsoft 365")}>
                Authorize with {form.auth === "oauth-google" ? "Google" : "Microsoft"}
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}

/* ------------------------------------------------ Automatic actions (cron) ------------------------------------------------ */

function CronTab() {
  const { autoCloseDays } = useStore();
  const initial = [
    { id: "c1", name: "Close resolved tickets", desc: `Close tickets resolved > ${autoCloseDays} days`, schedule: "every 1h", last: "2026-06-14T08:00:00Z", ok: true, enabled: true },
    { id: "c2", name: "SLA escalation sweep", desc: "Flag tickets crossing 80% of SLA", schedule: "every 15m", last: "2026-06-14T08:45:00Z", ok: true, enabled: true },
    { id: "c3", name: "Network discovery scan", desc: "Detect unmanaged devices on the network", schedule: "every 6h", last: "2026-06-14T06:00:00Z", ok: true, enabled: true },
    { id: "c4", name: "License & seat audit", desc: "Recount used vs purchased seats", schedule: "daily 02:00", last: "2026-06-14T02:00:00Z", ok: true, enabled: true },
    { id: "c5", name: "Certificate expiry alerts", desc: "Notify on certs expiring in 30 days", schedule: "daily 07:00", last: "2026-06-14T07:00:00Z", ok: false, enabled: true },
    { id: "c6", name: "Mailbox poll", desc: "Fetch e-mail from all receivers", schedule: "every 2m", last: "2026-06-14T08:54:00Z", ok: true, enabled: true },
    { id: "c7", name: "Reopen on reply", desc: "Reopen closed tickets on customer reply", schedule: "event-driven", last: "2026-06-13T16:22:00Z", ok: true, enabled: false },
  ];
  const [jobs, setJobs] = React.useState(initial);
  const toggle = (id) => setJobs((j) => j.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)));

  return (
    <>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--text-3)" }}>
        Scheduled background jobs. The “Close resolved tickets” cadence comes from Settings → Automatic actions.
      </p>
      <TableCard>
        <thead><tr>
          <th style={thStyle}>Action</th><th style={thStyle}>Schedule</th><th style={thStyle}>Last run</th>
          <th style={thStyle}>Result</th><th style={{ ...thStyle, textAlign: "right" }}>Enabled</th>
        </tr></thead>
        <tbody>
          {jobs.map((j) => (
            <HoverRow key={j.id}>
              <td style={{ ...tdStyle, fontFamily: "var(--font-sans)", color: "var(--text-1)", fontWeight: 500 }}>
                {j.name}
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{j.desc}</div>
              </td>
              <td style={tdStyle}><Badge tone="neutral">{j.schedule}</Badge></td>
              <td style={{ ...tdStyle, color: "var(--text-3)" }}>{j.enabled ? relTime(j.last) : "—"}</td>
              <td style={tdStyle}>
                {!j.enabled ? <span style={{ color: "var(--text-3)" }}>paused</span>
                  : j.ok ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--success)" }}>
                      <CheckCircle2 size={14} /> ok</span>
                  : <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--danger)" }}>
                      <AlertTriangle size={14} /> failed</span>}
              </td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <Switch size="sm" checked={j.enabled} onChange={() => toggle(j.id)} />
              </td>
            </HoverRow>
          ))}
        </tbody>
      </TableCard>
    </>
  );
}

/* ------------------------------------------------ Reminders & RSS ------------------------------------------------ */

const SEED_FEEDS = [
  { id: "f1", source: "NÚKIB · varovania", items: [
    { t: "Kritická zraniteľnosť v knižnici OpenSSL", when: "2026-06-13T14:00:00Z", sev: "high" },
    { t: "Phishingová kampaň cielená na .sk domény", when: "2026-06-12T09:30:00Z", sev: "medium" },
  ] },
  { id: "f2", source: "Microsoft Security", items: [
    { t: "Patch Tuesday — 64 fixes, 5 actively exploited", when: "2026-06-10T18:00:00Z", sev: "high" },
    { t: "Entra ID conditional access changes", when: "2026-06-09T11:00:00Z", sev: "low" },
  ] },
  { id: "f3", source: "The Hacker News", items: [
    { t: "New ransomware group targeting MSPs", when: "2026-06-13T07:45:00Z", sev: "medium" },
  ] },
];

function RemindersTab() {
  const { persona } = useStore();
  const [reminders, setReminders] = React.useState([
    { id: "m1", text: "Renew VPN gateway certificate (vpn.latto.io)", due: "2026-07-15", done: false },
    { id: "m2", text: "Move nightly backup window earlier — PRB-006", due: "2026-06-18", done: false },
    { id: "m3", text: "Review Q2 license usage before renewal", due: "2026-06-30", done: false },
    { id: "m4", text: "Decommission old file server", due: "2026-06-09", done: true },
  ]);
  const [text, setText] = React.useState("");
  const [due, setDue] = React.useState("");

  const add = () => {
    if (!text.trim()) return;
    setReminders((r) => [{ id: Math.random().toString(36).slice(2, 7), text: text.trim(), due, done: false }, ...r]);
    setText(""); setDue("");
  };
  const sevTone = { high: "danger", medium: "warning", low: "neutral" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, alignItems: "start" }}>
      <Card>
        <Eyebrow style={{ marginBottom: 12 }}>
          <Bell size={11} style={{ verticalAlign: "-1px", marginRight: 6 }} />MY REMINDERS · {persona.displayName.split(" ")[0]}
        </Eyebrow>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="New reminder…"
            wrapStyle={{ flex: 1 }} onKeyDown={(e) => e.key === "Enter" && add()} />
          <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} wrapStyle={{ width: 150 }} />
          <Button size="sm" iconLeft={<Plus size={14} />} onClick={add}>Add</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {reminders.map((r) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0",
              borderBottom: "1px solid var(--border-faint)" }}>
              <Switch size="sm" checked={r.done}
                onChange={() => setReminders((rs) => rs.map((x) => (x.id === r.id ? { ...x, done: !x.done } : x)))} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: r.done ? "var(--text-3)" : "var(--text-1)",
                  textDecoration: r.done ? "line-through" : "none" }}>{r.text}</div>
                {r.due && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>due {r.due}</div>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setReminders((rs) => rs.filter((x) => x.id !== r.id))}>
                <Trash2 size={13} />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Eyebrow style={{ marginBottom: 12 }}>
          <Rss size={11} style={{ verticalAlign: "-1px", marginRight: 6 }} />SECURITY FEEDS
        </Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SEED_FEEDS.map((f) => (
            <div key={f.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <ShieldAlert size={14} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{f.source}</span>
              </div>
              {f.items.map((it, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0 5px 22px" }}>
                  <Badge tone={sevTone[it.sev]}>{it.sev}</Badge>
                  <span style={{ fontSize: 13, color: "var(--text-2)", flex: 1 }}>{it.t}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{relTime(it.when)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function Automation() {
  const [tab, setTab] = React.useState("mail");
  return (
    <>
      <PageHeader eyebrow="ADMIN" title={<>Automation & mail{DEMO}</>}>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-3)" }}>
          Email-to-ticket, scheduled jobs and feeds. These screens are visual mock-ups — no live backend is connected.
        </p>
      </PageHeader>
      <Tabs value={tab} onChange={setTab} style={{ marginBottom: 16 }}
        tabs={[
          { value: "mail", label: "Mail receivers", icon: <Inbox size={15} /> },
          { value: "cron", label: "Automatic actions", icon: <Clock size={15} /> },
          { value: "reminders", label: "Reminders & RSS", icon: <Rss size={15} /> },
        ]} />
      {tab === "mail" && <MailReceiversTab />}
      {tab === "cron" && <CronTab />}
      {tab === "reminders" && <RemindersTab />}
    </>
  );
}
