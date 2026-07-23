"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

const LEVELS: Skill["level"][] = ["beginner", "intermediate", "advanced", "expert"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState({ name: "", category: "", level: "intermediate" as Skill["level"] });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.skills.list().then(setSkills).catch(() => {});
  }, []);

  async function handleAdd() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await api.skills.create(form);
      setSkills((prev) => [...prev, res]);
      setForm({ name: "", category: form.category, level: "intermediate" });
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.skills.delete(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch {}
  }

  const categories = [...new Set(skills.map((s) => s.category).filter(Boolean))];
  const filtered = filter
    ? skills.filter((s) => s.category === filter)
    : skills;

  const input =
    "bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Skills</h1>
        <p className="text-sm text-muted">What you know. Grouped by category.</p>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Skill name"
          className={input + " flex-1"}
        />
        <input
          type="text"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Category"
          className={input + " w-32"}
        />
        <select
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value as Skill["level"] })}
          className={input + " w-32"}
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={saving || !form.name.trim()}
          className="bg-fg text-bg px-3 py-2 rounded-md text-sm font-medium hover:bg-fg/90 transition-colors disabled:opacity-50 shrink-0"
        >
          Add
        </button>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-1.5 mb-4 flex-wrap">
          <button
            onClick={() => setFilter("")}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              filter === "" ? "bg-surface text-fg" : "text-muted hover:text-fg"
            }`}
          >
            All ({skills.length})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c === filter ? "" : c)}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                filter === c ? "bg-surface text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {c} ({skills.filter((s) => s.category === c).length})
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-surface/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">{s.name}</span>
              {s.category && (
                <span className="text-xs text-muted bg-bg border border-border px-1.5 py-0.5 rounded">
                  {s.category}
                </span>
              )}
              <span className={`text-xs ${levelColor(s.level)}`}>{s.level}</span>
            </div>
            <button
              onClick={() => handleDelete(s.id)}
              className="text-xs text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all px-2 py-1"
            >
              Delete
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted text-center py-12">
            {filter ? "No skills in this category." : "No skills yet. Add one above."}
          </p>
        )}
      </div>
    </div>
  );
}

function levelColor(level: string) {
  switch (level) {
    case "expert":
      return "text-accent";
    case "advanced":
      return "text-success";
    case "intermediate":
      return "text-muted";
    default:
      return "text-muted/60";
  }
}
