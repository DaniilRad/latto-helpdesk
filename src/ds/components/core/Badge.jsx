/**
 * Lätto Badge — a small mono status pill. Uppercase, wide-tracked label,
 * optional leading dot (with a live pulse for "active").
 */
export function Badge({ children, tone = "neutral", dot = false, pulse = false, style = {}, ...rest }) {
  const tones = {
    neutral: { bg: "var(--surface-3)", fg: "var(--text-2)", dotc: "var(--text-3)" },
    accent: { bg: "var(--accent-soft)", fg: "var(--accent-text)", dotc: "var(--accent)" },
    success: { bg: "var(--success-soft)", fg: "var(--success)", dotc: "var(--success)" },
    warning: { bg: "var(--warning-soft)", fg: "var(--warning)", dotc: "var(--warning)" },
    danger: { bg: "var(--danger-soft)", fg: "var(--danger)", dotc: "var(--danger)" },
    info: { bg: "var(--info-soft)", fg: "var(--info)", dotc: "var(--info)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        height: "1.5rem",
        padding: "0 var(--space-3)",
        background: t.bg,
        color: t.fg,
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-medium)",
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
        borderRadius: "var(--radius-full)",
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{ position: "relative", display: "inline-flex" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.dotc, display: "block" }} />
          {pulse && (
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: t.dotc,
                animation: "latto-pulse 1.6s var(--ease-out) infinite",
              }}
            />
          )}
        </span>
      )}
      {children}
      {pulse && (
        <style>{`@keyframes latto-pulse{0%{transform:scale(1);opacity:.7}70%{transform:scale(2.6);opacity:0}100%{opacity:0}}`}</style>
      )}
    </span>
  );
}
