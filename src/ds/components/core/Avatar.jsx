import React from "react";

/**
 * Lätto Avatar — circular identity token. Renders an image when `src` is
 * given, otherwise initials on a deterministic warm-neutral background.
 * Optional status dot in the corner.
 */
export function Avatar({ name = "", src, size = 36, status, style = {}, ...rest }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const statusColors = {
    online: "var(--success)",
    busy: "var(--danger)",
    away: "var(--warning)",
    offline: "var(--text-3)",
  };

  return (
    <span style={{ position: "relative", display: "inline-flex", flex: "0 0 auto", ...style }} {...rest}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          borderRadius: "var(--radius-full)",
          background: src ? "var(--surface-3)" : "var(--accent-soft)",
          color: "var(--accent-text)",
          border: "1px solid var(--border)",
          fontFamily: "var(--font-mono)",
          fontSize: Math.max(11, size * 0.36),
          fontWeight: "var(--weight-medium)",
          letterSpacing: "0.02em",
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {src ? (
          <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          initials || "?"
        )}
      </span>
      {status && (
        <span
          style={{
            position: "absolute",
            right: -1,
            bottom: -1,
            width: Math.max(8, size * 0.28),
            height: Math.max(8, size * 0.28),
            borderRadius: "50%",
            background: statusColors[status] || "var(--text-3)",
            border: "2px solid var(--bg)",
          }}
        />
      )}
    </span>
  );
}
