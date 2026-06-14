import React from "react";

/**
 * Lätto NavItem — a sidebar navigation row: icon + label, with an active
 * state (amber-soft well + accent text) and an optional trailing badge/count.
 */
export function NavItem({
  icon = null,
  children,
  active = false,
  badge = null,
  as = "button",
  style = {},
  ...rest
}) {
  const As = as;
  const [hover, setHover] = React.useState(false);
  return (
    <As
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        width: "100%",
        padding: "var(--space-2) var(--space-3)",
        border: "none",
        textAlign: "left",
        background: active ? "var(--accent-soft)" : hover ? "var(--surface-2)" : "transparent",
        color: active ? "var(--accent-text)" : hover ? "var(--text-1)" : "var(--text-2)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-sm)",
        fontWeight: active ? "var(--weight-medium)" : "var(--weight-regular)",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)",
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: "inline-flex", flex: "0 0 auto" }}>{icon}</span>}
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{children}</span>
      {badge != null && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: active ? "var(--accent-text)" : "var(--text-3)",
          }}
        >
          {badge}
        </span>
      )}
    </As>
  );
}
