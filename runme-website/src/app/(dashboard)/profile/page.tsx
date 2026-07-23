"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Profile {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
}

const defaultProfile: Profile = {
  displayName: "",
  bio: "",
  location: "",
  website: "",
  github: "",
  linkedin: "",
  twitter: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.profile
      .get()
      .then((res) => setProfile({ ...defaultProfile, ...res }))
      .catch(() => {});
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.profile.update(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  function update(field: keyof Profile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
      <p className="text-sm text-muted mb-8">
        This is what people see when they run your portfolio command.
      </p>

      <form onSubmit={handleSave} className="space-y-5">
        <Field
          label="Display name"
          value={profile.displayName}
          onChange={(v) => update("displayName", v)}
          placeholder="Jane Smith"
        />
        <Field
          label="Bio"
          value={profile.bio}
          onChange={(v) => update("bio", v)}
          placeholder="Full-stack developer. Building things that work."
          textarea
        />
        <Field
          label="Location"
          value={profile.location}
          onChange={(v) => update("location", v)}
          placeholder="San Francisco, CA"
        />
        <Field
          label="Website"
          value={profile.website}
          onChange={(v) => update("website", v)}
          placeholder="https://yoursite.dev"
        />
        <Field
          label="GitHub"
          value={profile.github}
          onChange={(v) => update("github", v)}
          placeholder="yourusername"
        />
        <Field
          label="LinkedIn"
          value={profile.linkedin}
          onChange={(v) => update("linkedin", v)}
          placeholder="yourusername"
        />
        <Field
          label="Twitter"
          value={profile.twitter}
          onChange={(v) => update("twitter", v)}
          placeholder="@yourhandle"
        />

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-fg text-bg px-4 py-2 rounded-md text-sm font-medium hover:bg-fg/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          {saved && <span className="text-success text-sm">Saved</span>}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors resize-none";
  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cls}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}
