import React from "react";

/** Inline: `code`, **bold**. Returns React nodes. */
function inline(text, keyBase) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`")) {
      return (
        <code
          key={`${keyBase}-${i}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.92em",
            background: "var(--surface-2)",
            border: "1px solid var(--border-faint)",
            borderRadius: 4,
            padding: "1px 5px",
            color: "var(--accent-text)",
          }}
        >
          {p.slice(1, -1)}
        </code>
      );
    }
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={`${keyBase}-${i}`} style={{ color: "var(--text-1)" }}>
          {p.slice(2, -2)}
        </strong>
      );
    }
    return p;
  });
}

/**
 * Tiny markdown subset renderer for KB articles:
 * "## " headings, "- " lists, paragraphs, `code`, **bold**.
 */
export function Markdown({ text }) {
  const blocks = (text || "").split(/\n{2,}/);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        if (lines[0].startsWith("## ")) {
          const rest = lines.slice(1).join("\n");
          return (
            <React.Fragment key={bi}>
              <h3 style={{ margin: "8px 0 0", fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>
                {lines[0].slice(3)}
              </h3>
              {rest && <Markdown text={rest} />}
            </React.Fragment>
          );
        }
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={bi} style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              {lines.map((l, li) => (
                <li key={li} style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.55 }}>
                  {inline(l.slice(2), `${bi}-${li}`)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi} style={{ margin: 0, fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>
            {lines.map((l, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, `${bi}-${li}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
