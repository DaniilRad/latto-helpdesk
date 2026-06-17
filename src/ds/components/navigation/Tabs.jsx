/**
 * Lätto Tabs — a horizontal tab bar with an amber underline indicator.
 * Controlled via `value`. tabs: [{ value, label, icon? }].
 */
export function Tabs({ tabs = [], value, onChange, style = {}, ...rest }) {
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        gap: "var(--space-1)",
        borderBottom: "1px solid var(--border)",
        ...style,
      }}
      {...rest}
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(t.value)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-3) var(--space-3)",
              marginBottom: -1,
              border: "none",
              borderBottom: `2px solid ${active ? "var(--accent)" : "transparent"}`,
              background: "transparent",
              color: active ? "var(--text-1)" : "var(--text-3)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)",
              fontWeight: active ? "var(--weight-medium)" : "var(--weight-regular)",
              cursor: "pointer",
              transition: "color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)",
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = "var(--text-1)";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.color = "var(--text-3)";
            }}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
