"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface SkillCategory {
  id: string;
  categoryName: string;
  description: string;
  skills: string[];
  skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
}

const LEVELS: SkillCategory["skillLevel"][] = ["beginner", "intermediate", "advanced", "expert"];

export default function SkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    categoryName: "",
    description: "",
    skills: "",
    skillLevel: "intermediate" as SkillCategory["skillLevel"],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.skills.list().then((data: any[]) => {
      setCategories(data.map((c) => ({
        id: c.id,
        categoryName: c.categoryName || "",
        description: c.description || "",
        skills: c.skills || [],
        skillLevel: c.skillLevel || "intermediate",
      })));
    }).catch((err) => console.error("Failed to load skills:", err));
  }, []);

  function startAdd() {
    setEditing("new");
    setForm({ categoryName: "", description: "", skills: "", skillLevel: "intermediate" });
  }

  function startEdit(c: SkillCategory) {
    setEditing(c.id);
    setForm({
      categoryName: c.categoryName,
      description: c.description,
      skills: c.skills.join(", "),
      skillLevel: c.skillLevel,
    });
  }

  async function handleSave() {
    setSaving(true);
    const data = {
      categoryName: form.categoryName,
      description: form.description,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      skillLevel: form.skillLevel,
    };
    try {
      if (editing === "new") {
        const res = await api.skills.create(data);
        setCategories((prev) => [...prev, { ...data, id: res.id }]);
      } else {
        await api.skills.update(editing, data);
        setCategories((prev) => prev.map((c) => (c.id === editing ? { ...c, ...data } : c)));
      }
      setEditing(null);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.skills.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {}
  }

  const input =
    "w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Skills</h1>
          <p className="text-sm text-muted">Grouped by category.</p>
        </div>
        <button
          onClick={startAdd}
          className="bg-surface border border-border px-3 py-1.5 rounded-md text-sm text-fg hover:bg-border transition-colors"
        >
          + Add Category
        </button>
      </div>

      {editing && (
        <div className="bg-surface border border-border rounded-lg p-4 mb-6 space-y-3">
          <input
            type="text"
            value={form.categoryName}
            onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
            placeholder="Category name (e.g. Languages, Frameworks)"
            className={input}
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional description"
            rows={2}
            className={input + " resize-none"}
          />
          <input
            type="text"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="Skills (comma-separated): TypeScript, React, Node.js"
            className={input}
          />
          <div>
            <label className="block text-xs text-muted mb-1">Skill level</label>
            <select
              value={form.skillLevel}
              onChange={(e) => setForm({ ...form, skillLevel: e.target.value as SkillCategory["skillLevel"] })}
              className={input}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving || !form.categoryName.trim()}
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

      <div className="space-y-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-surface border border-border rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{c.categoryName}</span>
                  <span className={`text-xs ${
                    c.skillLevel === "expert" ? "text-accent" :
                    c.skillLevel === "advanced" ? "text-success" :
                    "text-muted"
                  }`}>{c.skillLevel}</span>
                </div>
                {c.description && <p className="text-xs text-muted mt-1">{c.description}</p>}
              </div>
              <div className="flex gap-1 ml-4 shrink-0">
                <button
                  onClick={() => startEdit(c)}
                  className="text-xs text-muted hover:text-fg px-2 py-1 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs text-muted hover:text-error px-2 py-1 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            {c.skills.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {c.skills.map((s) => (
                  <span
                    key={s}
                    className="text-xs text-muted bg-bg border border-border px-1.5 py-0.5 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && !editing && (
          <p className="text-sm text-muted text-center py-12">
            No skill categories yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
