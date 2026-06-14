import React from "react";

/**
 * Lätto Input — single-line text field. Optional leading icon and a mono
 * affix (e.g. a unit or domain). Visible focus ring, soft corners.
 */
export function Input({
  icon = null,
  affix = null,
  invalid = false,
  size = "md",
  style = {},
  wrapStyle = {},
  ...rest
}) {
  const heights = { sm: "var(--control-h-sm)", md: "var(--control-h-md)", lg: "var(--control-h-lg)" };
  const [focus, setFocus] = React.useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "var(--space-2)",
        height: heights[size],
        padding: "0 var(--space-3)",
        background: "var(--surface-2)",
        border: `1px solid ${invalid ? "var(--danger)" : focus ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focus ? "var(--ring)" : "none",
        transition: "border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)",
        ...wrapStyle,
      }}
    >
      {icon && <span style={{ display: "inline-flex", color: "var(--text-3)", flex: "0 0 auto" }}>{icon}</span>}
      <input
        aria-invalid={invalid || undefined}
        onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
        {...rest}
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          color: "var(--text-1)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          ...style,
        }}
      />
      {affix && (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--text-3)", flex: "0 0 auto" }}>
          {affix}
        </span>
      )}
    </div>
  );
}
