import React from "react";

/**
 * Lätto Card — the base surface. Flat at rest (border + surface lift, no
 * shadow). `interactive` adds hover lift; `highlight` adds an amber wash +
 * top hairline for the rare emphasized card.
 */
export function Card({
  children,
  interactive = false,
  highlight = false,
  padding = "var(--space-5)",
  as = "div",
  style = {},
  ...rest
}) {
  const As = as;
  const [hover, setHover] = React.useState(false);
  return (
    <As
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        position: "relative",
        background: highlight ? "var(--accent-soft)" : hover ? "var(--surface-2)" : "var(--surface-1)",
        border: `1px solid ${highlight ? "color-mix(in srgb, var(--accent) 35%, transparent)" : hover ? "var(--border-strong)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        padding,
        cursor: interactive ? "pointer" : "default",
        transition: "background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)",
        transform: hover ? "translateY(-1px)" : "none",
        ...style,
      }}
      {...rest}
    >
      {highlight && (
        <span style={{ position: "absolute", left: "var(--space-5)", right: "var(--space-5)", top: 0, height: 2, background: "var(--accent)", borderRadius: "var(--radius-full)" }} />
      )}
      {children}
    </As>
  );
}
