/**
 * Horizontal bar chart — mono labels, amber-and-neutral bars.
 * data: [{ label, value, color? }]
 */
export function BarChart({ data, maxBars = 8 }) {
  const rows = data.slice(0, maxBars);
  const max = Math.max(1, ...rows.map((d) => d.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((d) => (
        <div
          key={d.label}
          style={{ display: "grid", gridTemplateColumns: "92px 1fr 32px", gap: 10, alignItems: "center" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--text-3)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {d.label}
          </span>
          <div
            style={{
              height: 10,
              background: "var(--surface-2)",
              borderRadius: "var(--radius-full)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(d.value / max) * 100}%`,
                height: "100%",
                borderRadius: "var(--radius-full)",
                background: d.color || "var(--accent)",
                transition: "width var(--dur-slow) var(--ease-out)",
              }}
            />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-1)", textAlign: "right" }}>
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Grouped monthly bars — two series side by side per month (e.g. new vs
 * resolved tickets). series: [{ label, color, values: number[] }], one value
 * per month label.
 */
export function MonthlyBars({ months, series, height = 150 }) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 0, height, borderBottom: "1px solid var(--border)" }}>
        {months.map((m, mi) => (
          <div
            key={m.key}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 4,
              height: "100%",
            }}
          >
            {series.map((s) => (
              <div
                key={s.label}
                title={`${m.label} · ${s.label}: ${s.values[mi]}`}
                style={{
                  width: 14,
                  height: `${(s.values[mi] / max) * 92}%`,
                  minHeight: s.values[mi] > 0 ? 3 : 0,
                  background: s.color,
                  borderRadius: "3px 3px 0 0",
                  transition: "height var(--dur-slow) var(--ease-out)",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: 6 }}>
        {months.map((m) => (
          <span
            key={m.key}
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--text-3)",
            }}
          >
            {m.label}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 10, justifyContent: "center" }}>
        {series.map((s) => (
          <span
            key={s.label}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-2)" }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Donut chart — SVG ring with a centered total.
 * segments: [{ label, value, color }]
 */
export function Donut({ segments, size = 148, stroke = 16, centerLabel }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative", flex: "0 0 auto", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
          {total > 0 &&
            segments.map((s) => {
              const frac = s.value / total;
              const dash = `${frac * c} ${c}`;
              const el = (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={dash}
                  strokeDashoffset={-offset * c}
                  strokeLinecap="butt"
                />
              );
              offset += frac;
              return el;
            })}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 24, color: "var(--text-1)" }}>{total}</span>
          {centerLabel && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "var(--text-3)",
              }}
            >
              {centerLabel}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flex: "0 0 auto" }} />
            <span style={{ fontSize: 13, color: "var(--text-2)", flex: 1 }}>{s.label}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-1)" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
