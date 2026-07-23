"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: "cyberpunk", name: "Cyberpunk", colors: ["#ff00ff", "#00ffff", "#ffff00"] },
  { id: "dracula", name: "Dracula", colors: ["#bd93f9", "#ff79c6", "#50fa7b"] },
  { id: "gruvbox", name: "Gruvbox", colors: ["#fabd2f", "#fb4934", "#b8bb26"] },
  { id: "nord", name: "Nord", colors: ["#88c0d0", "#81a1c1", "#a3be8c"] },
  { id: "monokai", name: "Monokai", colors: ["#f92672", "#a6e22e", "#66d9ef"] },
  { id: "tokyo-night", name: "Tokyo Night", colors: ["#7aa2f7", "#bb9af7", "#9ece6a"] },
];

const ANIMATIONS = [
  "typewriter", "matrix", "glitch", "wave", "fadeIn", "scanLine",
  "decrypt", "neonGlow", "bounceIn", "slideIn", "colorCycle",
  "pixelate", "typewriterDelete", "fire", "rainbowWave",
];

interface ThemeConfig {
  theme: string;
  animation: string;
  customColor: string;
}

export default function ThemePage() {
  const [config, setConfig] = useState<ThemeConfig>({
    theme: "cyberpunk",
    animation: "typewriter",
    customColor: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.theme
      .get()
      .then((res) => setConfig({ ...config, ...res }))
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await api.theme.update(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Theme</h1>
        <p className="text-sm text-muted">
          Customize how your portfolio looks in the terminal.
        </p>
      </div>

      {/* Theme picker */}
      <div className="mb-8">
        <h2 className="text-xs text-muted uppercase tracking-wider mb-3">Color theme</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setConfig({ ...config, theme: t.id, customColor: "" })}
              className={cn(
                "border rounded-lg p-3 text-left transition-colors",
                config.theme === t.id && !config.customColor
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-muted"
              )}
            >
              <div className="flex gap-1 mb-2">
                {t.colors.map((c) => (
                  <div
                    key={c}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom color */}
      <div className="mb-8">
        <h2 className="text-xs text-muted uppercase tracking-wider mb-3">Custom color</h2>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.customColor || "#3b82f6"}
            onChange={(e) => setConfig({ ...config, customColor: e.target.value, theme: "" })}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
          <input
            type="text"
            value={config.customColor}
            onChange={(e) => setConfig({ ...config, customColor: e.target.value, theme: "" })}
            placeholder="#3b82f6"
            className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg font-mono placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors w-36"
          />
          {config.customColor && (
            <button
              onClick={() => setConfig({ ...config, customColor: "", theme: "cyberpunk" })}
              className="text-xs text-muted hover:text-fg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Animation picker */}
      <div className="mb-8">
        <h2 className="text-xs text-muted uppercase tracking-wider mb-3">Entrance animation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {ANIMATIONS.map((a) => (
            <button
              key={a}
              onClick={() => setConfig({ ...config, animation: a })}
              className={cn(
                "border rounded-md px-3 py-2 text-sm text-left transition-colors font-mono",
                config.animation === a
                  ? "border-accent bg-accent/5 text-fg"
                  : "border-border text-muted hover:text-fg hover:border-muted"
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-fg text-bg px-4 py-2 rounded-md text-sm font-medium hover:bg-fg/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save theme"}
        </button>
        {saved && <span className="text-success text-sm">Saved</span>}
      </div>
    </div>
  );
}
