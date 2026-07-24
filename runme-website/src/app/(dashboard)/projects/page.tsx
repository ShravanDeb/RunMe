"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  tags: string[];
  featured: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", url: "", tags: "", featured: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.projects.list().then((data: any[]) => {
      setProjects(data.map((p) => ({
        id: p.id,
        title: p.title || "",
        subtitle: p.subtitle || "",
        description: p.description || "",
        url: p.githubRepoUrl || p.liveDemoUrl || "",
        tags: p.tags || [],
        featured: p.featured || false,
      })));
    }).catch((err) => console.error("Failed to load projects:", err));
  }, []);

  function startAdd() {
    setEditing("new");
    setForm({ title: "", subtitle: "", description: "", url: "", tags: "", featured: false });
  }

  function startEdit(p: Project) {
    setEditing(p.id);
    setForm({
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      url: p.url,
      tags: p.tags.join(", "),
      featured: p.featured,
    });
  }

  async function handleSave() {
    setSaving(true);
    const data = {
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      githubRepoUrl: form.url,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
    };
    try {
      if (editing === "new") {
        const res = await api.projects.create(data);
        setProjects((prev) => [...prev, {
          id: res.id, title: data.title, subtitle: data.subtitle,
          description: data.description, url: data.githubRepoUrl,
          tags: data.tags, featured: data.featured,
        }]);
      } else {
        await api.projects.update(editing, data);
        setProjects((prev) => prev.map((p) => (p.id === editing ? {
          ...p, title: data.title, subtitle: data.subtitle,
          description: data.description, url: data.githubRepoUrl,
          tags: data.tags, featured: data.featured,
        } : p)));
      }
      setEditing(null);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.projects.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  }

  const input =
    "w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Projects</h1>
          <p className="text-sm text-muted">Show what you&apos;ve built.</p>
        </div>
        <button
          onClick={startAdd}
          className="bg-surface border border-border px-3 py-1.5 rounded-md text-sm text-fg hover:bg-border transition-colors"
        >
          + Add
        </button>
      </div>

      {editing && (
        <div className="bg-surface border border-border rounded-lg p-4 mb-6 space-y-3">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Project name"
            className={input}
          />
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Short subtitle (optional)"
            className={input}
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does it do?"
            rows={2}
            className={input + " resize-none"}
          />
          <input
            type="text"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://github.com/..."
            className={input}
          />
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Tags (comma-separated): typescript, react, cli"
            className={input}
          />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-accent"
            />
            Featured
          </label>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
              className="bg-fg text-bg px-4 py-1.5 rounded-md text-sm font-medium hover:bg-fg/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="text-sm text-muted hover:text-fg transition-colors px-3 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-surface border border-border rounded-lg p-4 flex items-start justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{p.title}</span>
                {p.featured && (
                  <span className="text-xs text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                    featured
                  </span>
                )}
              </div>
              {p.subtitle && <p className="text-xs text-muted mt-1">{p.subtitle}</p>}
              <p className="text-xs text-muted mt-1 line-clamp-2">{p.description}</p>
              {p.tags.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs text-muted bg-bg border border-border px-1.5 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1 ml-4 shrink-0">
              <button
                onClick={() => startEdit(p)}
                className="text-xs text-muted hover:text-fg px-2 py-1 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-muted hover:text-error px-2 py-1 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && !editing && (
          <p className="text-sm text-muted text-center py-12">
            No projects yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
