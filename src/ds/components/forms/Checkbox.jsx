/**
 * Lätto Checkbox — square check with soft corners. Amber when checked.
 * Controlled via `checked`. Optional label.
 */
export function Checkbox({ checked = false, onChange, disabled = false, label, style = {}, ...rest }) {
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  const box = (
    <span
      role="checkbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        flex: "0 0 auto",
        borderRadius: "var(--radius-xs)",
        background: checked ? "var(--accent)" : "var(--surface-2)",
        border: `1px solid ${checked ? "transparent" : "var(--border-strong)"}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)",
        ...style,
      }}
      {...rest}
    >
      {checked && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent-contrast)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  );
  if (!label) return box;
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-3)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {box}
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
        {label}
      </span>
    </label>
  );
}
