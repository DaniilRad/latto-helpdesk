import React from "react";
import { Card } from "../ds";

/** Mono uppercase eyebrow label. */
export function Eyebrow({ children, style = {} }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        color: "var(--text-3)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PageHeader({ title, eyebrow, actions, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        {eyebrow && <Eyebrow style={{ marginBottom: 6 }}>{eyebrow}</Eyebrow>}
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: "var(--text-1)" }}>
          {title}
        </h2>
        {children}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

/** Form field: mono label above a control, with optional required mark + error. */
export function Field({ label, children, span = 1, required = false, error = null }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the form control is passed in as `children` and wrapped by this label.
    <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: `span ${span}` }}>
      <Eyebrow>
        {label}
        {required && (
          <span style={{ color: "var(--danger)", marginLeft: 4 }} aria-hidden="true">
            *
          </span>
        )}
      </Eyebrow>
      {children}
      {error && (
        <span role="alert" style={{ fontSize: 12, color: "var(--danger)", fontFamily: "var(--font-sans)" }}>
          {error}
        </span>
      )}
    </label>
  );
}

export const thStyle = {
  textAlign: "left",
  padding: "10px 14px",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  color: "var(--text-3)",
  fontWeight: 500,
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

/**
 * Column sorting for tables. `getters` maps sort keys to value extractors.
 * Returns sorted rows plus props for SortableTh.
 */
export function useSort(rows, getters, defaultKey = null, defaultDir = 1) {
  const [key, setKey] = React.useState(defaultKey);
  const [dir, setDir] = React.useState(defaultDir);
  const toggle = (k) => {
    if (k === key) setDir((d) => -d);
    else {
      setKey(k);
      setDir(1);
    }
  };
  const sorted = React.useMemo(() => {
    if (!key || !getters[key]) return rows;
    const get = getters[key];
    return [...rows].sort((a, b) => {
      const va = get(a),
        vb = get(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb), undefined, { numeric: true }) * dir;
    });
  }, [rows, key, dir, getters]);
  return { sorted, sortKey: key, sortDir: dir, toggle };
}

/** Clickable, sort-aware table header cell. Shows a dim ⇅ affordance when
 *  inactive and a bold accent ↑/↓ when it's the active sort column. */
export function SortableTh({ k, sort, children, align = "left", style = {} }) {
  const active = sort.sortKey === k;
  return (
    <th
      aria-sort={active ? (sort.sortDir === 1 ? "ascending" : "descending") : "none"}
      style={{ ...thStyle, textAlign: align, ...style }}
    >
      <button
        type="button"
        onClick={() => sort.toggle(k)}
        title="Sort by this column"
        style={{
          display: "inline-flex",
          alignItems: "center",
          border: "none",
          background: "transparent",
          padding: 0,
          font: "inherit",
          letterSpacing: "inherit",
          textTransform: "inherit",
          cursor: "pointer",
          userSelect: "none",
          color: active ? "var(--accent-text)" : "var(--text-3)",
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.color = "var(--text-1)";
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.color = "var(--text-3)";
        }}
      >
        {children}
        <span
          aria-hidden="true"
          style={{
            marginLeft: 5,
            fontSize: 11,
            color: active ? "var(--accent-text)" : "var(--text-3)",
            opacity: active ? 1 : 0.45,
            fontWeight: active ? 700 : 400,
          }}
        >
          {active ? (sort.sortDir === 1 ? "↑" : "↓") : "⇅"}
        </span>
      </button>
    </th>
  );
}

export const tdStyle = {
  padding: "11px 14px",
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  color: "var(--text-2)",
  borderBottom: "1px solid var(--border-faint)",
  verticalAlign: "middle",
};

/** Keep short, atomic cells (IDs, dates, numbers, badges) on a single line. */
export const tdNoWrap = { ...tdStyle, whiteSpace: "nowrap" };

/**
 * Props that make a non-semantic clickable element keyboard-operable:
 * focusable, activates on Enter/Space, and exposed as a button to a11y tools.
 * The global :focus-visible ring (base.css) supplies the focus affordance.
 * Activation is ignored when the event originates from a nested control.
 */
export function rowActivation(onActivate, opts = {}) {
  return {
    role: "button",
    tabIndex: 0,
    onClick: onActivate,
    // Carrying the accessible name here (rather than as a literal JSX attribute
    // on the element) keeps aria-label paired with the role this helper sets.
    ...(opts.label !== undefined ? { "aria-label": opts.label } : {}),
    ...(opts.expanded !== undefined ? { "aria-expanded": opts.expanded } : {}),
    onKeyDown: (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate(e);
      }
    },
  };
}

/** Table wrapper card with hoverable rows. */
export function TableCard({ children }) {
  return (
    <Card padding="0" style={{ overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>
    </Card>
  );
}

export function HoverRow({ onClick, children }) {
  return (
    <tr className="latto-rowhover" style={{ cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      {children}
    </tr>
  );
}

/** A full-width "no rows" message inside a table body. */
export function TableEmptyRow({ colSpan, children = "Nothing here yet." }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{
          ...tdStyle,
          textAlign: "center",
          color: "var(--text-3)",
          padding: "26px 14px",
          fontFamily: "var(--font-sans)",
          borderBottom: "none",
        }}
      >
        {children}
      </td>
    </tr>
  );
}

export function EmptyState({ icon, text, action }) {
  return (
    <Card padding="40px" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {icon && <span style={{ color: "var(--text-3)", display: "inline-flex" }}>{icon}</span>}
      <p style={{ margin: 0, color: "var(--text-2)", fontSize: 14 }}>{text}</p>
      {action}
    </Card>
  );
}

export function StatCard({ label, value, sub, tone }) {
  const subColor =
    tone === "danger"
      ? "var(--danger)"
      : tone === "warning"
        ? "var(--warning)"
        : tone === "success"
          ? "var(--success)"
          : "var(--text-3)";
  return (
    <Card padding="16px 18px">
      <Eyebrow>{label}</Eyebrow>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--text-1)" }}>{value}</span>
        {sub && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: subColor }}>{sub}</span>}
      </div>
    </Card>
  );
}
