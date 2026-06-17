import React from "react";

/**
 * Lätto CodeBlock — mono code with an optional filename header and a copy
 * button. Sharp body corners (rounded only when no header). No syntax
 * highlighting engine — pass pre-formatted text.
 */
export function CodeBlock({ code = "", filename, lang = "txt", style = {}, ...rest }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (_e) {}
  };
  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        fontFamily: "var(--font-mono)",
        ...style,
      }}
      {...rest}
    >
      {(filename || true) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--space-2) var(--space-3) var(--space-2) var(--space-4)",
            background: "var(--surface-2)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)", letterSpacing: "var(--tracking-wide)" }}>
            {filename || lang}
          </span>
          <button
            type="button"
            onClick={copy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: copied ? "var(--success)" : "var(--text-3)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: "var(--radius-sm)",
            }}
            onMouseEnter={(e) => {
              if (!copied) e.currentTarget.style.color = "var(--text-1)";
            }}
            onMouseLeave={(e) => {
              if (!copied) e.currentTarget.style.color = "var(--text-3)";
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: "var(--space-4)",
          fontSize: "var(--text-sm)",
          lineHeight: 1.65,
          color: "var(--text-1)",
          overflowX: "auto",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
