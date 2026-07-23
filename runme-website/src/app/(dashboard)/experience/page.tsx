"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Exp {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export default function ExperiencePage() {
  const [items, setItems] = useState<Exp[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    company: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.experience.list().then(setItems).catch(() => {});
  }, []);

  function startAdd() {
    setEditing("new");
    setForm({ company: "", role: "", description: "", startDate: "", endDate: "", current: false });
  }

  function startEdit(e: Exp) {
    setEditing(e.id);
    setForm({
      company: e.company,
      role: e.role,
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing === "new") {
        const res = await api.experience.create(form);
        setItems((prev) => [...prev, res]);
      } else {
        await api.experience.update(editing, form);
        setItems((prev) => prev.map((e) => (e.id === editing ? { ...e, ...form } : e)));
      }
      setEditing(null);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.experience.delete(id);
      setItems((prev) => prev.filter((e) => e.id !== id));
    } catch {}
  }

  const input =
    "w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Experience</h1>
          <p className="text-sm text-muted">Your work history.</p>
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
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Company"
              className={input}
            />
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Role"
              className={input}
            />
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What did you do there?"
            rows={3}
            className={input + " resize-none"}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Start date</label>
              <input
                type="text"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                placeholder="2023-01"
                className={input}
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">End date</label>
              <input
                type="text"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                placeholder="Present"
                disabled={form.current}
                className={input + (form.current ? " opacity-50" : "")}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? "" : form.endDate })}
              className="accent-accent"
            />
            Current position
          </label>
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

      <div className="space-y-2">
        {items.map((e) => (
          <div
            key={e.id}
            className="bg-surface border border-border rounded-lg p-4 flex items-start justify-between"
          >
            <div className="min-w-0">
              <span className="font-medium text-sm">{e.role}</span>
              <span className="text-muted text-sm"> at {e.company}</span>
              <p className="text-xs text-muted mt-1">
                {e.startDate} — {e.current ? "Present" : e.endDate}
              </p>
              {e.description && (
                <p className="text-xs text-muted mt-1.5 line-clamp-2">{e.description}</p>
              )}
            </div>
            <div className="flex gap-1 ml-4 shrink-0">
              <button
                onClick={() => startEdit(e)}
                className="text-xs text-muted hover:text-fg px-2 py-1 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                className="text-xs text-muted hover:text-error px-2 py-1 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && (
          <p className="text-sm text-muted text-center py-12">
            No experience yet. Add your first role.
          </p>
        )}
      </div>
    </div>
  );
}
