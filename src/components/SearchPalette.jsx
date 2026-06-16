import { Search } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Input } from "../ds";
import { DEVICE_STATUS, DEVICE_TYPES, USER_STATUS } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";
import { Eyebrow } from "./bits.jsx";

/**
 * Global search — grouped results across devices, AD users, and software.
 * Sections render only for collections the persona may read.
 */
export function SearchPalette() {
  const { devices, users, software, hasPerm } = useStore();
  const nav = useNavigate();
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const boxRef = React.useRef(null);

  React.useEffect(() => {
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  if (!hasPerm("devices.read")) return null;

  const needle = q.trim().toLowerCase();
  const hit = (fields) => fields.join(" ").toLowerCase().includes(needle);

  const deviceHits = needle
    ? devices.filter((d) => hit([d.name, d.brand, d.model, d.serial, d.ip, d.mac, d.location])).slice(0, 5)
    : [];
  const userHits =
    needle && hasPerm("users.read")
      ? users.filter((u) => hit([u.displayName, u.sam, u.email, u.department, u.title])).slice(0, 5)
      : [];
  const softwareHits = needle
    ? software.filter((s) => hit([s.name, s.publisher, s.version, s.category])).slice(0, 5)
    : [];

  const total = deviceHits.length + userHits.length + softwareHits.length;

  const go = (path) => {
    nav(path);
    setQ("");
    setOpen(false);
  };
  const first = () => {
    if (deviceHits[0]) return go(`/devices/${deviceHits[0].id}`);
    if (userHits[0]) return go(`/users/${userHits[0].id}`);
    if (softwareHits[0]) return go("/software");
  };

  // Keyboard-accessible result row: shared `.latto-rowhover` lights up on hover
  // and keyboard focus alike; button semantics make Tab/Enter/Space work.
  const Row = ({ onClick, children }) => (
    <div
      className="latto-rowhover"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", cursor: "pointer" }}
    >
      {children}
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ padding: "8px 0 4px" }}>
      <Eyebrow style={{ padding: "0 14px 4px" }}>{title}</Eyebrow>
      {children}
    </div>
  );

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <Input
        placeholder="Search devices, users, software…"
        aria-label="Global search"
        icon={<Search size={16} />}
        size="sm"
        wrapStyle={{ width: 270 }}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") first();
          if (e.key === "Escape") {
            setQ("");
            setOpen(false);
          }
        }}
      />
      {open && needle && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            width: 380,
            zIndex: 1500,
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-pop)",
            overflow: "hidden",
            maxHeight: 480,
            overflowY: "auto",
          }}
        >
          {total === 0 && (
            <p style={{ margin: 0, padding: "14px", fontSize: 13, color: "var(--text-3)" }}>
              Nothing matches "{q.trim()}".
            </p>
          )}
          {deviceHits.length > 0 && (
            <Section title="DEVICES">
              {deviceHits.map((d) => {
                const T = (DEVICE_TYPES[d.type] || DEVICE_TYPES.peripheral).icon;
                return (
                  <Row key={d.id} onClick={() => go(`/devices/${d.id}`)}>
                    <T
                      size={15}
                      style={{ color: (DEVICE_TYPES[d.type] || DEVICE_TYPES.peripheral).color, flex: "0 0 auto" }}
                    />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-1)" }}>
                      {d.name}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-3)",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.brand} {d.model}
                    </span>
                    <Badge tone={DEVICE_STATUS[d.status]?.tone || "neutral"}>
                      {DEVICE_STATUS[d.status]?.label || d.status}
                    </Badge>
                  </Row>
                );
              })}
            </Section>
          )}
          {userHits.length > 0 && (
            <Section title="USERS">
              {userHits.map((u) => (
                <Row key={u.id} onClick={() => go(`/users/${u.id}`)}>
                  <span style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500 }}>{u.displayName}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--text-3)",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u.sam} · {u.department}
                  </span>
                  <Badge tone={USER_STATUS[u.status]?.tone || "neutral"}>
                    {USER_STATUS[u.status]?.label || u.status}
                  </Badge>
                </Row>
              ))}
            </Section>
          )}
          {softwareHits.length > 0 && (
            <Section title="SOFTWARE">
              {softwareHits.map((s) => (
                <Row key={s.id} onClick={() => go("/software")}>
                  <span style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)", flex: 1 }}>
                    {s.publisher} · {s.version}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
                    {(s.installs || []).length} installs
                  </span>
                </Row>
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}
