import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Ticket, MonitorSmartphone, Users, ShieldCheck, Settings,
  Moon, Sunset, Sun, BookOpen, Package, UserCog, CalendarDays, Droplets,
  FileSignature, Globe, CalendarClock, Building2, Boxes, Workflow,
} from "lucide-react";
import { NavItem, Avatar, IconButton, Toast, Badge, Select } from "../ds";
import { Eyebrow } from "./bits.jsx";
import { SearchPalette } from "./SearchPalette.jsx";
import { useStore } from "../lib/store.jsx";
import { ROLES } from "../lib/rbac.js";
import { OPEN_STATUSES, PROBLEM_OPEN_STATUSES, slaState } from "../lib/meta.js";
import markUrl from "../ds/assets/latto-mark-amber.svg";

function Sidebar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { devices, users, tickets, consumables, problems, persona, personaRole, hasPerm } = useStore();

  const myOpen = tickets.filter((t) => t.requesterId === persona.id && OPEN_STATUSES.includes(t.status));
  const allOpen = tickets.filter((t) => OPEN_STATUSES.includes(t.status));
  const lowStock = consumables.filter((c) => c.stock < c.min).length;
  const openProblems = problems.filter((p) => PROBLEM_OPEN_STATUSES.includes(p.status)).length;

  const sections = [
    {
      title: null,
      items: [
        { to: "/", icon: LayoutDashboard, label: "Overview", show: true },
        { to: "/tickets", icon: Ticket, label: hasPerm("tickets.all") ? "Tickets" : "My tickets",
          badge: hasPerm("tickets.all") ? allOpen.length : (myOpen.length || null), show: true },
        { to: "/problems", icon: Boxes, label: "Problems", badge: openProblems || null, show: hasPerm("tickets.all") },
        { to: "/planning", icon: CalendarDays, label: "Planning", show: hasPerm("tickets.all") },
        { to: "/kb", icon: BookOpen, label: "Knowledge base", show: true },
      ],
    },
    {
      title: "INVENTORY",
      items: [
        { to: "/devices", icon: MonitorSmartphone, label: "Devices", badge: devices.length, show: hasPerm("devices.read") },
        { to: "/software", icon: Package, label: "Software", show: hasPerm("devices.read") },
        { to: "/consumables", icon: Droplets, label: "Consumables", badge: lowStock || null, show: hasPerm("devices.read") },
        { to: "/contracts", icon: FileSignature, label: "Contracts & certs", show: hasPerm("devices.read") },
        { to: "/infrastructure", icon: Globe, label: "Infrastructure", show: hasPerm("devices.read") },
        { to: "/reservations", icon: CalendarClock, label: "Reservations", show: true },
      ],
    },
    {
      title: "ADMIN",
      items: [
        { to: "/users", icon: Users, label: "AD users", badge: users.length, show: hasPerm("users.read") },
        { to: "/roles", icon: ShieldCheck, label: "Roles, teams & org", show: hasPerm("rules.manage") },
        { to: "/automation", icon: Workflow, label: "Automation & mail", show: hasPerm("settings.manage") },
        { to: "/settings", icon: Settings, label: "Settings", show: hasPerm("settings.manage") },
      ],
    },
  ]
    .map((s) => ({ ...s, items: s.items.filter((i) => i.show) }))
    .filter((s) => s.items.length > 0);

  const isActive = (to) => (to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to));

  return (
    <aside style={{ width: 248, flex: "0 0 auto", borderRight: "1px solid var(--border)",
      background: "var(--surface-1)", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px 12px" }}>
        <img src={markUrl} width="28" height="28" style={{ borderRadius: "var(--radius-sm)" }} alt="" />
        <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.02em", color: "var(--text-1)" }}>
          Helpdesk hub
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)",
          border: "1px solid var(--border)", padding: "2px 6px", borderRadius: 6 }}>v0.3</span>
      </div>
      <div style={{ padding: "0 10px 10px", display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
        {sections.map((s, si) => (
          <React.Fragment key={si}>
            {s.title && <Eyebrow style={{ padding: "12px 12px 4px", fontSize: 10 }}>{s.title}</Eyebrow>}
            {s.items.map((it) => (
              <NavItem key={it.to} icon={<it.icon size={18} />} badge={it.badge || undefined}
                active={isActive(it.to)} onClick={() => nav(it.to)}>
                {it.label}
              </NavItem>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div style={{ padding: 10, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px" }}>
          <Avatar name={persona.displayName} size={32} status="online" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{persona.displayName}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              {ROLES[personaRole]?.label.toLowerCase()}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  const {
    theme, setTheme, tickets, users, entities, persona, setPersona, roleOf, hasPerm,
    personaIsStaff, entityFilter, setEntityFilter, slaConfig,
  } = useStore();
  const themeIcons = { dark: Moon, dusk: Sunset, light: Sun };
  const ThemeIcon = themeIcons[theme] || Moon;
  const cycle = () => setTheme(theme === "dark" ? "dusk" : theme === "dusk" ? "light" : "dark");

  const open = tickets.filter((t) => OPEN_STATUSES.includes(t.status));
  const breached = open.filter((t) => {
    const s = slaState(t, Date.now(), slaConfig);
    return s.respond.state === "breached" || s.resolve.state === "breached";
  });

  const personaOptions = users
    .filter((u) => u.status === "enabled")
    .map((u) => ({ value: u.id, label: `${u.displayName} · ${ROLES[roleOf(u).role]?.label}` }));

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 22px",
      borderBottom: "1px solid var(--border)",
      background: "color-mix(in srgb, var(--bg) 80%, transparent)", backdropFilter: "blur(12px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)",
        fontSize: 13, color: "var(--text-3)" }}>
        <span>latto.io</span><span>/</span><span style={{ color: "var(--text-1)" }}>helpdesk</span>
        {hasPerm("tickets.all") && breached.length > 0 && (
          <Badge tone="danger" dot pulse style={{ marginLeft: 6 }}>{breached.length} SLA breached</Badge>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <SearchPalette />
      {personaIsStaff && entities.length > 1 && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <Building2 size={15} style={{ color: "var(--text-3)" }} />
          <Select size="sm" value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}
            style={{ width: 150 }}
            options={[{ value: "all", label: "All entities" },
              ...entities.map((en) => ({ value: en.id, label: en.name }))]} />
        </span>
      )}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
        <UserCog size={15} style={{ color: "var(--text-3)" }} title="View as" />
        <Select size="sm" value={persona.id} onChange={(e) => setPersona(e.target.value)}
          style={{ width: 210 }} options={personaOptions} />
      </span>
      <IconButton label="Toggle theme" variant="surface" onClick={cycle}><ThemeIcon size={18} /></IconButton>
    </div>
  );
}

function ToastStack() {
  const { toasts, dismissToast } = useStore();
  if (toasts.length === 0) return null;
  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 2000,
      display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <Toast key={t.id} tone={t.tone} title={t.title} message={t.message} onClose={() => dismissToast(t.id)} />
      ))}
    </div>
  );
}

export function Shell() {
  return (
    <div style={{ height: "100vh", display: "flex", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar />
        <main style={{ flex: 1, overflow: "auto", padding: "22px 26px" }}>
          <Outlet />
        </main>
      </div>
      <ToastStack />
    </div>
  );
}
