import { Check, ChevronLeft, ChevronRight, Maximize2, Plus, SlidersHorizontal, X } from "lucide-react";
import React from "react";
import { Eyebrow, PageHeader } from "../components/bits.jsx";
import { WIDGETS } from "../components/widgets.jsx";
import { Button, Card } from "../ds";
import { useStore } from "../lib/store.jsx";
import { Portal } from "./Portal.jsx";

function TechDashboard() {
  const { dashboardLayout, setDashboardLayout } = useStore();
  const [editing, setEditing] = React.useState(false);

  const layout = dashboardLayout.filter((w) => WIDGETS[w.key]);
  const unused = Object.keys(WIDGETS).filter((k) => !layout.some((w) => w.key === k));

  const update = (next) => setDashboardLayout(next);
  const remove = (key) => update(layout.filter((w) => w.key !== key));
  const add = (key) => update([...layout, { key, size: WIDGETS[key].sizes[0] }]);
  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= layout.length) return;
    const next = [...layout];
    [next[idx], next[j]] = [next[j], next[idx]];
    update(next);
  };
  const resize = (idx) => {
    const w = layout[idx];
    const sizes = WIDGETS[w.key].sizes;
    const nextSize = sizes[(sizes.indexOf(w.size) + 1) % sizes.length] || sizes[0];
    update(layout.map((x, i) => (i === idx ? { ...x, size: nextSize } : x)));
  };

  return (
    <>
      <PageHeader
        eyebrow="HELPDESK · OVERVIEW"
        title="Good shift"
        actions={
          <Button
            variant={editing ? "primary" : "secondary"}
            size="sm"
            iconLeft={editing ? <Check size={15} /> : <SlidersHorizontal size={15} />}
            onClick={() => setEditing((e) => !e)}
          >
            {editing ? "Done" : "Customize"}
          </Button>
        }
      />

      {editing && unused.length > 0 && (
        <Card padding="var(--space-4) var(--space-5)" style={{ marginBottom: "var(--space-4)" }}>
          <Eyebrow style={{ marginBottom: "var(--space-3)" }}>ADD WIDGET</Eyebrow>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {unused.map((k) => (
              <Button key={k} variant="secondary" size="sm" iconLeft={<Plus size={14} />} onClick={() => add(k)}>
                {WIDGETS[k].title}
              </Button>
            ))}
          </div>
        </Card>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)", alignItems: "stretch" }}
      >
        {layout.map((w, idx) => {
          const def = WIDGETS[w.key];
          const Comp = def.component;
          return (
            <div key={w.key} style={{ gridColumn: `span ${Math.min(w.size, 4)}`, position: "relative", minWidth: 0 }}>
              {editing && (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    zIndex: 5,
                    display: "flex",
                    gap: 2,
                    background: "var(--surface-1)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: 2,
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={idx === 0}
                    onClick={() => move(idx, -1)}
                    style={{ padding: "0 6px" }}
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={idx === layout.length - 1}
                    onClick={() => move(idx, 1)}
                    style={{ padding: "0 6px" }}
                  >
                    <ChevronRight size={14} />
                  </Button>
                  {def.sizes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => resize(idx)}
                      title="Cycle size"
                      style={{ padding: "0 6px" }}
                    >
                      <Maximize2 size={13} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(w.key)}
                    style={{ padding: "0 6px", color: "var(--danger)" }}
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
              <div
                style={{
                  height: "100%",
                  outline: editing ? "1px dashed var(--border-strong)" : "none",
                  outlineOffset: 3,
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <Comp />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/** Role-aware home: technicians+ get the ops dashboard, end-users the portal. */
export function Dashboard() {
  const { hasPerm } = useStore();
  return hasPerm("tickets.all") ? <TechDashboard /> : <Portal />;
}
