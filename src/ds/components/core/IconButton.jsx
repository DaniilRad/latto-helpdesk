import React from "react";

/**
 * Lätto IconButton — a square, icon-only control for toolbars and chrome.
 * Pass a Lucide icon node (or any glyph) as children.
 */
export function IconButton({
  children,
  size = "md",
  variant = "ghost",
  label,
  disabled = false,
  style = {},
  ...rest
}) {
  const dims = { sm: "var(--control-h-sm)", md: "var(--control-h-md)", lg: "var(--control-h-lg)" };
  const palettes = {
    ghost: { background: "transparent", color: "var(--text-2)", border: "1px solid transparent" },
    surface: { background: "var(--surface-2)", color: "var(--text-1)", border: "1px solid var(--border)" },
    accent: { background: "var(--accent)", color: "var(--accent-contrast)", border: "1px solid transparent" },
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: dims[size],
    height: dims[size],
    borderRadius: "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)",
    ...palettes[variant],
    ...style,
  };
  const onEnter = (e) => {
    if (disabled) return;
    if (variant === "ghost") { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text-1)"; }
    else if (variant === "surface") e.currentTarget.style.background = "var(--surface-3)";
    else if (variant === "accent") e.currentTarget.style.background = "var(--accent-hover)";
  };
  const onLeave = (e) => {
    e.currentTarget.style.background = palettes[variant].background;
    e.currentTarget.style.color = palettes[variant].color;
    e.currentTarget.style.transform = "none";
  };
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      style={base}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.94)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "none"; }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </button>
  );
}
