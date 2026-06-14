import React from "react";
import { Download, RotateCcw, Clock, Timer } from "lucide-react";
import { Card, Select, Button, Dialog, Input, Badge } from "../ds";
import { PageHeader, Eyebrow } from "../components/bits.jsx";
import { PRIORITY } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

export function Settings() {
  const {
    theme, setTheme, devices, users, tickets, kb, exportData, resetData,
    slaConfig, setSlaTarget, autoCloseDays, setAutoCloseDays,
  } = useStore();
  const [confirming, setConfirming] = React.useState(false);

  return (
    <>
      <PageHeader eyebrow="WORKSPACE" title="Settings" />
      <div style={{ maxWidth: 620, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 16, margin: "0 0 4px", color: "var(--text-1)" }}>Appearance</h3>
          <p style={{ fontSize: 13, color: "var(--text-3)", margin: "0 0 16px" }}>
            Choose how Helpdesk hub looks on this device.
          </p>
          <Select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ width: 220 }}
            options={[
              { value: "dark", label: "Dark" },
              { value: "dusk", label: "Dusk (in-between)" },
              { value: "light", label: "Light" },
            ]} />
        </Card>

        <Card>
          <h3 style={{ fontSize: 16, margin: "0 0 4px", color: "var(--text-1)" }}>
            <Timer size={16} style={{ verticalAlign: "-2px", marginRight: 8, color: "var(--accent)" }} />
            Service levels (SLA)
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-3)", margin: "0 0 16px" }}>
            Response and resolution targets per priority, in hours. A warning fires at 80% of the limit.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              {["Priority", "Respond (h)", "Resolve (h)"].map((h, i) => (
                <th key={h} style={{ textAlign: i === 0 ? "left" : "center", padding: "0 8px 10px",
                  fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase",
                  color: "var(--text-3)", fontWeight: 500 }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {Object.entries(PRIORITY).map(([p, meta]) => (
                <tr key={p}>
                  <td style={{ padding: "5px 8px" }}>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </td>
                  {["respond", "resolve"].map((field) => (
                    <td key={field} style={{ padding: "5px 8px", textAlign: "center" }}>
                      <Input type="number" min="0" step="0.5"
                        value={slaConfig[p]?.[field] ?? ""}
                        onChange={(e) => setSlaTarget(p, field, Number(e.target.value))}
                        wrapStyle={{ width: 90, margin: "0 auto" }} style={{ textAlign: "center" }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 style={{ fontSize: 16, margin: "0 0 4px", color: "var(--text-1)" }}>
            <Clock size={16} style={{ verticalAlign: "-2px", marginRight: 8, color: "var(--accent)" }} />
            Automatic actions
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-3)", margin: "0 0 16px" }}>
            Resolved tickets close automatically after a quiet period (GLPI-style cron, runs on load).
          </p>
          <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Eyebrow>Auto-close resolved after</Eyebrow>
            <Input type="number" min="1" max="60" value={autoCloseDays}
              onChange={(e) => setAutoCloseDays(Math.max(1, Number(e.target.value) || 1))}
              wrapStyle={{ width: 90 }} style={{ textAlign: "center" }} />
            <span style={{ fontSize: 13, color: "var(--text-3)" }}>days</span>
          </label>
        </Card>

        <Card>
          <h3 style={{ fontSize: 16, margin: "0 0 4px", color: "var(--text-1)" }}>Data</h3>
          <p style={{ fontSize: 13, color: "var(--text-3)", margin: "0 0 14px" }}>
            Everything lives in this browser's local storage.
          </p>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {[["Tickets", tickets.length], ["Devices", devices.length], ["AD users", users.length], ["KB articles", kb.length]].map(([l, v]) => (
              <div key={l}>
                <Eyebrow>{l}</Eyebrow>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, color: "var(--text-1)", marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" iconLeft={<Download size={15} />} onClick={exportData}>Export JSON</Button>
            <Button variant="danger" iconLeft={<RotateCcw size={15} />} onClick={() => setConfirming(true)}>
              Reset to demo data
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={confirming} onClose={() => setConfirming(false)}
        title="Reset all data?" description="Your changes are replaced with the demo dataset. This can't be undone."
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setConfirming(false) },
          { label: "Reset", variant: "danger", onClick: () => { setConfirming(false); resetData(); } },
        ]} />
    </>
  );
}
