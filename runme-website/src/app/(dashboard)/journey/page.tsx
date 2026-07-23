"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "job" | "project" | "education" | "achievement" | "other";
}

const TYPE_COLORS: Record<string, string> = {
  job: "bg-accent",
  project: "bg-success",
  education: "bg-[#eab308]",
  achievement: "bg-[#a855f7]",
  other: "bg-muted",
};

const TYPE_LABELS: Record<string, string> = {
  job: "Job",
  project: "Project",
  education: "Education",
  achievement: "Achievement",
  other: "Other",
};

export default function JourneyPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    type: "job" as Milestone["type"],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.experience
      .list()
      .then((data: any[]) => {
        const mapped = data.map((e) => ({
          id: e.id,
          title: `${e.role} at ${e.company}`,
          description: e.description || "",
          date: e.startDate || "",
          type: "job" as const,
        }));
        mapped.sort((a, b) => (a.date > b.date ? -1 : 1));
        setMilestones(mapped);
      })
      .catch(() => {});
  }, []);

  function startAdd() {
    setEditing("new");
    setForm({ title: "", description: "", date: "", type: "job" });
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const data = { ...form, company: form.title, role: "", startDate: form.date, description: form.description };
      const res = await api.experience.create(data);
      setMilestones((prev) => {
        const next = [...prev, { id: res.id, ...form }];
        next.sort((a, b) => (a.date > b.date ? -1 : 1));
        return next;
      });
      setEditing(null);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  const input =
    "w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Journey</h1>
          <p className="text-sm text-muted">Your career timeline. Visualized.</p>
        </div>
        <button
          onClick={startAdd}
          className="bg-surface border border-border px-3 py-1.5 rounded-md text-sm text-fg hover:bg-border transition-colors"
        >
          + Add milestone
        </button>
      </div>

      {editing && (
        <div className="bg-surface border border-border rounded-lg p-4 mb-6 space-y-3">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className={input}
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows={2}
            className={input + " resize-none"}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="Date (e.g. 2024-01)"
              className={input}
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Milestone["type"] })}
              className={input}
            >
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
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

      {/* Timeline */}
      <div className="relative pl-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

        {milestones.map((m) => (
          <div key={m.id} className="relative mb-6 last:mb-0">
            <div
              className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-bg ${TYPE_COLORS[m.type] || TYPE_COLORS.other}`}
            />
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{m.title}</span>
                <span className="text-xs text-muted font-mono">{m.date}</span>
              </div>
              <span
                className={`inline-block text-xs px-1.5 py-0.5 rounded mb-2 ${TYPE_COLORS[m.type]} text-bg`}
              >
                {TYPE_LABELS[m.type]}
              </span>
              {m.description && (
                <p className="text-xs text-muted leading-relaxed">{m.description}</p>
              )}
            </div>
          </div>
        ))}

        {milestones.length === 0 && !editing && (
          <p className="text-sm text-muted text-center py-12">
            No milestones yet. Add your career milestones above.
          </p>
        )}
      </div>
    </div>
  );
}
