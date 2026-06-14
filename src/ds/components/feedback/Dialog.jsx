import React from "react";
import { Button } from "../core/Button.jsx";

/**
 * Lätto Dialog — a centered modal over a dark scrim. Controlled via `open`.
 * Provide title, children (body), and an actions array rendered as buttons.
 * action shape: { label, variant?, onClick?, autoFocus? }
 */
export function Dialog({ open, onClose, title, description, children, actions = [], width = 440, ...rest }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-5)",
        background: "var(--overlay)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        animation: "latto-fade var(--dur-base) var(--ease-out)",
      }}
      {...rest}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width,
          maxWidth: "100%",
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-pop)",
          padding: "var(--space-6)",
          animation: "latto-rise var(--dur-base) var(--ease-out)",
        }}
      >
        {title && <h3 style={{ fontSize: "var(--text-lg)", margin: "0 0 var(--space-2)" }}>{title}</h3>}
        {description && (
          <p style={{ color: "var(--text-2)", fontSize: "var(--text-sm)", margin: "0 0 var(--space-4)", lineHeight: 1.5 }}>
            {description}
          </p>
        )}
        {children}
        {actions.length > 0 && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", marginTop: "var(--space-5)" }}>
            {actions.map((a, i) => (
              <Button key={i} variant={a.variant || (i === actions.length - 1 ? "primary" : "ghost")} onClick={a.onClick} autoFocus={a.autoFocus}>
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes latto-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes latto-rise { from { opacity: 0; transform: translateY(8px) scale(0.98) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
}
