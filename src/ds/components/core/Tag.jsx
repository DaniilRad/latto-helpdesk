/**
 * Lätto Tag — a sans-serif chip for categories, filters, and keywords.
 * Optional leading dot color and a removable "×". Sentence-case label.
 */
export function Tag({ children, color, removable = false, onRemove, style = {}, ...rest }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        height: "1.75rem",
        padding: "0 var(--space-3)",
        background: "var(--surface-2)",
        color: "var(--text-1)",
        border: "1px solid var(--border)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--weight-medium)",
        borderRadius: "var(--radius-full)",
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {color && <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flex: "0 0 auto" }} />}
      {children}
      {removable && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 16,
            height: 16,
            marginRight: -2,
            padding: 0,
            border: "none",
            background: "transparent",
            color: "var(--text-3)",
            cursor: "pointer",
            borderRadius: "var(--radius-full)",
            fontSize: 14,
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-3)";
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
