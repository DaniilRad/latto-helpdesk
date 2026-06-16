/**
 * Lätto Terminal — the signature console surface. A titled window with a
 * sharp-cornered body, mono text, optional traffic-light dots, and a
 * blinking cursor. Pass `lines` for quick prompt output, or children for
 * full control.
 *
 * line shape: { text, prompt?: string|false, tone?: "muted"|"accent"|"success"|"danger" }
 */
export function Terminal({ title = "zsh", lines = null, dots = true, cursor = false, children, style = {}, ...rest }) {
  const toneColor = {
    muted: "var(--text-3)",
    accent: "var(--accent-text)",
    success: "var(--success)",
    danger: "var(--danger)",
    default: "var(--text-1)",
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          padding: "var(--space-2) var(--space-4)",
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {dots && (
          <span style={{ display: "inline-flex", gap: 6, marginRight: "var(--space-2)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--danger)", opacity: 0.85 }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--warning)", opacity: 0.85 }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--success)", opacity: 0.85 }} />
          </span>
        )}
        <span style={{ fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-wide)", color: "var(--text-3)" }}>
          {title}
        </span>
      </div>
      <div
        style={{
          padding: "var(--space-4)",
          fontSize: "var(--text-sm)",
          lineHeight: 1.7,
          color: "var(--text-1)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {lines
          ? lines.map((ln, i) => {
              const prompt = ln.prompt === undefined ? "›" : ln.prompt;
              return (
                <div key={i} style={{ color: toneColor[ln.tone] || toneColor.default }}>
                  {prompt && <span style={{ color: "var(--accent-text)", marginRight: 8 }}>{prompt}</span>}
                  {ln.text}
                </div>
              );
            })
          : children}
        {cursor && (
          <span
            style={{
              display: "inline-block",
              width: "0.6em",
              height: "1.1em",
              marginLeft: 2,
              transform: "translateY(0.2em)",
              background: "var(--accent)",
              animation: "latto-blink 1.1s steps(1) infinite",
            }}
          />
        )}
        <style>{`@keyframes latto-blink{50%{opacity:0}}`}</style>
      </div>
    </div>
  );
}
