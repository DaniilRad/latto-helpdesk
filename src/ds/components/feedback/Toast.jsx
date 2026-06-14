import React from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, Zap, X } from "lucide-react";

/**
 * Lätto Toast — a floating notification card. Tone sets the leading accent
 * bar + icon color. Use a fixed-position stack container to hold several.
 * (Icons adapted to lucide-react for this project.)
 */
export function Toast({ tone = "neutral", title, message, onClose, action, style = {}, ...rest }) {
  const tones = {
    neutral: { c: "var(--text-2)", icon: Info },
    success: { c: "var(--success)", icon: CheckCircle2 },
    warning: { c: "var(--warning)", icon: AlertTriangle },
    danger: { c: "var(--danger)", icon: XCircle },
    accent: { c: "var(--accent)", icon: Zap },
  };
  const t = tones[tone] || tones.neutral;
  const ToneIcon = t.icon;
  return (
    <div
      role="status"
      style={{
        position: "relative",
        display: "flex",
        gap: "var(--space-3)",
        width: 340,
        maxWidth: "100%",
        padding: "var(--space-3) var(--space-4)",
        paddingLeft: "var(--space-4)",
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${t.c}`,
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-lg)",
        animation: "latto-toast var(--dur-slow) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ color: t.c, flex: "0 0 auto", marginTop: 1, display: "inline-flex" }}>
        <ToneIcon size={18} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontWeight: "var(--weight-medium)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>{title}</div>}
        {message && <div style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginTop: title ? 2 : 0, lineHeight: 1.45 }}>{message}</div>}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            style={{ marginTop: 8, border: "none", background: "transparent", padding: 0, cursor: "pointer",
                     color: "var(--accent-text)", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}
          >
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          style={{ border: "none", background: "transparent", color: "var(--text-3)", cursor: "pointer", padding: 2, flex: "0 0 auto", display: "inline-flex" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-3)"; }}
        >
          <X size={16} />
        </button>
      )}
      <style>{`@keyframes latto-toast{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
