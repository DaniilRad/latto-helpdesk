import { ArrowLeft, BookOpen, Globe, Lock, Pencil, Plus, Search, Trash2 } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState, Field, PageHeader } from "../components/bits.jsx";
import { Textarea } from "../components/ticketBits.jsx";
import { Badge, Button, Card, Dialog, Input, Select, Tag } from "../ds";
import { Markdown } from "../lib/md.jsx";
import { relTime } from "../lib/meta.js";
import { useStore } from "../lib/store.jsx";

function ArticleDialog({ open, onClose, article }) {
  const { addArticle, saveArticle, persona } = useStore();
  const nav = useNavigate();
  const [form, setForm] = React.useState({});
  const editing = Boolean(article);

  React.useEffect(() => {
    if (open) {
      setForm(
        article
          ? { ...article, tagsText: (article.tags || []).join(", ") }
          : { title: "", category: "General", visibility: "public", body: "", tagsText: "" },
      );
    }
  }, [open, article]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.title?.trim()) return;
    const payload = {
      title: form.title.trim(),
      category: form.category.trim() || "General",
      visibility: form.visibility,
      body: form.body,
      tags: form.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (editing) saveArticle(article.id, payload);
    else {
      const id = addArticle(payload, persona.id);
      nav(`/kb/${id}`);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={680}
      title={editing ? "Edit article" : "New article"}
      description="Markdown-lite: ## headings, - lists, **bold**, `code`."
      actions={[
        { label: "Cancel", variant: "ghost", onClick: onClose },
        { label: editing ? "Save" : "Publish", variant: "primary", onClick: submit },
      ]}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Title" span={2}>
          <Input
            value={form.title || ""}
            onChange={set("title")}
            placeholder="Set up VPN on a company notebook"
            autoFocus
          />
        </Field>
        <Field label="Category">
          <Input value={form.category || ""} onChange={set("category")} placeholder="Network" />
        </Field>
        <Field label="Visibility">
          <Select
            value={form.visibility}
            onChange={set("visibility")}
            style={{ width: "100%" }}
            options={[
              { value: "public", label: "Public — self-service" },
              { value: "internal", label: "Internal — IT only" },
            ]}
          />
        </Field>
        <Field label="Tags (comma-separated)" span={2}>
          <Input value={form.tagsText || ""} onChange={set("tagsText")} placeholder="vpn, remote" />
        </Field>
        <Field label="Body" span={2}>
          <Textarea
            value={form.body || ""}
            onChange={set("body")}
            style={{ minHeight: 220, fontFamily: "var(--font-mono)", fontSize: 13 }}
          />
        </Field>
      </div>
    </Dialog>
  );
}

export function KbList() {
  const { kb, hasPerm } = useStore();
  const nav = useNavigate();
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("all");
  const [creating, setCreating] = React.useState(false);

  const visible = kb.filter((a) => a.visibility === "public" || hasPerm("kb.internal"));
  const cats = [...new Set(visible.map((a) => a.category))].sort();
  const needle = q.trim().toLowerCase();
  const filtered = visible.filter((a) => {
    if (cat !== "all" && a.category !== cat) return false;
    if (!needle) return true;
    return [a.title, a.body, (a.tags || []).join(" ")].join(" ").toLowerCase().includes(needle);
  });

  return (
    <>
      <PageHeader
        eyebrow="KNOWLEDGE BASE"
        title="Knowledge base"
        actions={
          hasPerm("kb.write") && (
            <Button iconLeft={<Plus size={16} />} onClick={() => setCreating(true)}>
              New article
            </Button>
          )
        }
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          placeholder="Search articles…"
          icon={<Search size={16} />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          wrapStyle={{ width: 280 }}
        />
        <Select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={{ width: 170 }}
          options={[{ value: "all", label: "All categories" }, ...cats.map((c) => ({ value: c, label: c }))]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpen size={28} />} text="No articles match. Write the one you wish existed." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {filtered.map((a) => (
            <Card key={a.id} interactive onClick={() => nav(`/kb/${a.id}`)} padding="18px">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Badge tone={a.visibility === "internal" ? "warning" : "success"}>
                  {a.visibility === "internal" ? (
                    <Lock size={9} style={{ marginRight: 4 }} />
                  ) : (
                    <Globe size={9} style={{ marginRight: 4 }} />
                  )}
                  {a.visibility}
                </Badge>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
                  {a.category}
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", lineHeight: 1.35 }}>{a.title}</div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "var(--text-3)",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {a.body.replace(/[#*`\-\n]/g, " ").slice(0, 160)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                {(a.tags || []).slice(0, 3).map((t) => (
                  <Tag key={t} style={{ height: "1.4rem", fontSize: 12 }}>
                    {t}
                  </Tag>
                ))}
                <span
                  style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}
                >
                  {a.views || 0} views · {relTime(a.updatedAt)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ArticleDialog open={creating} onClose={() => setCreating(false)} />
    </>
  );
}

export function KbArticle() {
  const { id } = useParams();
  const nav = useNavigate();
  const { kb, users, hasPerm, deleteArticle, bumpArticleViews } = useStore();
  const [editing, setEditing] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  const article = kb.find((a) => a.id === id);
  const allowed = article && (article.visibility === "public" || hasPerm("kb.internal"));

  React.useEffect(() => {
    if (allowed) bumpArticleViews(id);
    // count a view once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, bumpArticleViews, allowed]);

  if (!allowed) {
    return (
      <>
        <Button variant="ghost" size="sm" iconLeft={<ArrowLeft size={15} />} onClick={() => nav("/kb")}>
          Knowledge base
        </Button>
        <p style={{ color: "var(--text-2)" }}>
          {article ? "This article is internal." : "This article doesn't exist anymore."}
        </p>
      </>
    );
  }

  const author = users.find((u) => u.id === article.authorId);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        iconLeft={<ArrowLeft size={15} />}
        onClick={() => nav("/kb")}
        style={{ marginBottom: 10 }}
      >
        Knowledge base
      </Button>

      <PageHeader
        eyebrow={`${article.category.toUpperCase()} · ${article.visibility.toUpperCase()}`}
        title={article.title}
        actions={
          hasPerm("kb.write") && (
            <>
              <Button variant="secondary" iconLeft={<Pencil size={15} />} onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button variant="danger" iconLeft={<Trash2 size={15} />} onClick={() => setConfirming(true)}>
                Delete
              </Button>
            </>
          )
        }
      >
        <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>
            by {author?.displayName || "—"} · updated {relTime(article.updatedAt)} · {article.views || 0} views
          </span>
        </div>
      </PageHeader>

      <Card style={{ maxWidth: 760 }}>
        <Markdown text={article.body} />
        {(article.tags || []).length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid var(--border-faint)",
            }}
          >
            {article.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </Card>

      <ArticleDialog open={editing} onClose={() => setEditing(false)} article={article} />
      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Delete this article?"
        description="This can't be undone."
        actions={[
          { label: "Cancel", variant: "ghost", onClick: () => setConfirming(false) },
          {
            label: "Delete",
            variant: "danger",
            onClick: () => {
              deleteArticle(article.id);
              nav("/kb");
            },
          },
        ]}
      />
    </>
  );
}
