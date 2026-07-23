"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Profile {
  name: string;
  title: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  phone: string;
}

const defaultProfile: Profile = {
  name: "",
  title: "",
  bio: "",
  location: "",
  website: "",
  github: "",
  linkedin: "",
  phone: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [bannerText, setBannerText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      api.profile.get().catch(() => null),
      api.theme.get().catch(() => null),
    ]).then(([profileRes, themeRes]) => {
      if (profileRes) {
        setProfile({
          name: profileRes.name || "",
          title: profileRes.title || "",
          bio: profileRes.bio || "",
          location: profileRes.location || "",
          website: profileRes.website || "",
          github: profileRes.github || "",
          linkedin: profileRes.linkedin || "",
          phone: profileRes.phone || "",
        });
      }
      if (themeRes) {
        setBannerText(themeRes.asciiBanner || "");
      }
      setLoaded(true);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.profile.update(profile);
      await api.theme.update({ asciiBanner: bannerText });
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

      {!loaded && (
        <p className="text-sm text-muted">Loading...</p>
      )}

      {loaded && (
        <form onSubmit={handleSave} className="space-y-5">
          <Field
            label="Name"
            value={profile.name}
            onChange={(v) => update("name", v)}
            placeholder="Jane Smith"
          />
          <Field
            label="Title"
            value={profile.title}
            onChange={(v) => update("title", v)}
            placeholder="Full-stack Developer"
          />
          <Field
            label="Bio"
            value={profile.bio}
            onChange={(v) => update("bio", v)}
            placeholder="Building things that work."
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
            label="GitHub username"
            value={profile.github}
            onChange={(v) => update("github", v)}
            placeholder="yourusername"
          />
          <Field
            label="LinkedIn username"
            value={profile.linkedin}
            onChange={(v) => update("linkedin", v)}
            placeholder="yourusername"
          />
          <Field
            label="Phone"
            value={profile.phone}
            onChange={(v) => update("phone", v)}
            placeholder="+1 234 567 890"
          />

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted mb-4">
              Customize the ASCII art banner shown in the terminal. Leave empty for default.
            </p>
            <Field
              label="Banner text"
              value={bannerText}
              onChange={setBannerText}
              placeholder="Run Me"
            />
          </div>

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
      )}
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


