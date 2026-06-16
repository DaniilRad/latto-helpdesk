/**
 * Lätto Switch — a pill toggle. Amber when on. Controlled via `checked`.
 */
export function Switch({ checked = false, onChange, disabled = false, size = "md", label, style = {}, ...rest }) {
  const dims = size === "sm" ? { w: 36, h: 20, k: 14 } : { w: 46, h: 26, k: 20 };
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  const control = (
    <span
      role="switch"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: dims.w,
        height: dims.h,
        flex: "0 0 auto",
        borderRadius: "var(--radius-full)",
        background: checked ? "var(--accent)" : "var(--surface-3)",
        border: `1px solid ${checked ? "transparent" : "var(--border)"}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--dur-base) var(--ease)",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: checked ? dims.w - dims.k - 3 : 3,
          transform: "translateY(-50%)",
          width: dims.k,
          height: dims.k,
          borderRadius: "50%",
          background: checked ? "var(--accent-contrast)" : "var(--text-1)",
          transition: "left var(--dur-base) var(--ease)",
        }}
      />
    </span>
  );
  if (!label) return control;
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-3)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {control}
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
        {label}
      </span>
    </label>
  );
}
