import React from "react";

/**
 * Lätto Tooltip — a small dark bubble on hover/focus. Wraps a single child;
 * positions above by default. Pure CSS-free positioning via state.
 */
export function Tooltip({ label, side = "top", children, style = {} }) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    left: { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    right: { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
  };
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: non-interactive wrapper whose hover/focus only reveals the tooltip; the trigger lives in `children`.
    <span
      style={{ position: "relative", display: "inline-flex", ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            zIndex: 1100,
            ...pos[side],
            padding: "6px 10px",
            background: "var(--surface-3)",
            color: "var(--text-1)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-md)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "var(--tracking-wide)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            animation: "latto-tip var(--dur-fast) var(--ease-out)",
          }}
        >
          {label}
          <style>{`@keyframes latto-tip{from{opacity:0;transform:${pos[side].transform || ""} translateY(2px)}to{opacity:1}}`}</style>
        </span>
      )}
    </span>
  );
}
