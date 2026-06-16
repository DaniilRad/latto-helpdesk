import React from "react";
import { Button } from "../core/Button.jsx";

/**
 * Lätto Dialog — a centered modal over a dark scrim. Controlled via `open`.
 * Provide title, children (body), and an actions array rendered as buttons.
 * action shape: { label, variant?, onClick?, autoFocus?, disabled? }
 */
let dialogSeq = 0;

export function Dialog({ open, onClose, title, description, children, actions = [], width = 440, ...rest }) {
  const panelRef = React.useRef(null);
  const prevFocusRef = React.useRef(null);
  const idRef = React.useRef(`latto-dialog-${++dialogSeq}`);
  const titleId = title ? `${idRef.current}-title` : undefined;
  const descId = description ? `${idRef.current}-desc` : undefined;

  React.useEffect(() => {
    if (!open) return;
    prevFocusRef.current = document.activeElement;
    const panel = panelRef.current;
    const focusables = () =>
      panel.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

    // Initial focus: respect a child `autoFocus`, otherwise focus the first
    // focusable control (falling back to the panel itself).
    const raf = requestAnimationFrame(() => {
      if (!panel.contains(document.activeElement)) {
        const f = focusables();
        (f[0] || panel).focus();
      }
    });

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (f.length === 0) {
        e.preventDefault();
        return;
      }
      const first = f[0],
        last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      // Restore focus to whatever was focused before the dialog opened.
      if (prevFocusRef.current && typeof prevFocusRef.current.focus === "function") {
        prevFocusRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
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
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        style={{
          outline: "none",
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
        {title && (
          <h3 id={titleId} style={{ fontSize: "var(--text-lg)", margin: "0 0 var(--space-2)" }}>
            {title}
          </h3>
        )}
        {description && (
          <p
            id={descId}
            style={{
              color: "var(--text-2)",
              fontSize: "var(--text-sm)",
              margin: "0 0 var(--space-4)",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
        {children}
        {actions.length > 0 && (
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", marginTop: "var(--space-5)" }}
          >
            {actions.map((a, i) => (
              <Button
                key={i}
                variant={a.variant || (i === actions.length - 1 ? "primary" : "ghost")}
                onClick={a.onClick}
                autoFocus={a.autoFocus}
                disabled={a.disabled}
              >
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
