import React from "react";

/**
 * Lätto Button — the primary action primitive.
 * Variants: primary (amber fill), secondary (surface), ghost (transparent),
 * danger (red). Sizes: sm / md / lg. Honest press, visible focus ring.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft = null,
  iconRight = null,
  block = false,
  disabled = false,
  type = "button",
  style = {},
  ...rest
}) {
  const heights = { sm: "var(--control-h-sm)", md: "var(--control-h-md)", lg: "var(--control-h-lg)" };
  const pads = { sm: "0 var(--space-3)", md: "0 var(--space-4)", lg: "0 var(--space-5)" };
  const fonts = { sm: "var(--text-sm)", md: "var(--text-sm)", lg: "var(--text-base)" };

  const palettes = {
    primary: {
      background: "var(--accent)",
      color: "var(--accent-contrast)",
      border: "1px solid transparent",
    },
    secondary: {
      background: "var(--surface-2)",
      color: "var(--text-1)",
      border: "1px solid var(--border)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-1)",
      border: "1px solid transparent",
    },
    danger: {
      background: "var(--danger-soft)",
      color: "var(--danger)",
      border: "1px solid color-mix(in srgb, var(--danger) 40%, transparent)",
    },
  };

  const base = {
    display: block ? "flex" : "inline-flex",
    width: block ? "100%" : "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-2)",
    height: heights[size],
    padding: pads[size],
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--weight-medium)",
    fontSize: fonts[size],
    lineHeight: 1,
    borderRadius: "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)",
    userSelect: "none",
    whiteSpace: "nowrap",
    ...palettes[variant],
    ...style,
  };

  const onDown = (e) => { if (!disabled) e.currentTarget.style.transform = "translateY(0.5px) scale(0.99)"; };
  const onUp = (e) => { e.currentTarget.style.transform = "none"; };
  const onEnter = (e) => {
    if (disabled) return;
    if (variant === "primary") e.currentTarget.style.background = "var(--accent-hover)";
    else if (variant === "secondary") e.currentTarget.style.background = "var(--surface-3)";
    else if (variant === "ghost") e.currentTarget.style.background = "var(--surface-2)";
    else if (variant === "danger") e.currentTarget.style.background = "color-mix(in srgb, var(--danger) 22%, transparent)";
  };
  const onLeave = (e) => {
    e.currentTarget.style.background = palettes[variant].background;
    e.currentTarget.style.transform = "none";
  };

  return (
    <button
      type={type}
      disabled={disabled}
      style={base}
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
