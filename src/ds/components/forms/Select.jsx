import React from "react";

/**
 * Lätto Select — a native <select> styled to match Lätto inputs, with a
 * custom chevron. Pass options as [{value,label}] or children <option>s.
 */
export function Select({ options, size = "md", invalid = false, style = {}, children, ...rest }) {
  const heights = { sm: "var(--control-h-sm)", md: "var(--control-h-md)", lg: "var(--control-h-lg)" };
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex", width: style.width || "auto" }}>
      <select
        {...rest}
        onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: "100%",
          height: heights[size],
          padding: "0 var(--space-7) 0 var(--space-3)",
          background: "var(--surface-2)",
          color: "var(--text-1)",
          border: `1px solid ${invalid ? "var(--danger)" : focus ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "var(--radius-md)",
          boxShadow: focus ? "var(--ring)" : "none",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          cursor: "pointer",
          outline: "none",
          transition: "border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)",
          ...style,
        }}
      >
        {options
          ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)
          : children}
      </select>
      <span style={{ position: "absolute", right: "var(--space-3)", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-3)", display: "inline-flex" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
}
