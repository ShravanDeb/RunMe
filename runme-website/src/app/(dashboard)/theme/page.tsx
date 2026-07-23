"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: "cyberpunk", name: "Cyberpunk", accent: "#ff00ff", secondary: "#00ffff", muted: "#666680", bg: "#0a0a0f", fg: "#00ffff" },
  { id: "dracula", name: "Dracula", accent: "#bd93f9", secondary: "#ff79c6", muted: "#6272a4", bg: "#282a36", fg: "#f8f8f2" },
  { id: "gruvbox", name: "Gruvbox", accent: "#d65d0e", secondary: "#458588", muted: "#928374", bg: "#282828", fg: "#ebdbb2" },
  { id: "nord", name: "Nord", accent: "#88c0d0", secondary: "#81a1c1", muted: "#4c566a", bg: "#2e3440", fg: "#eceff4" },
  { id: "monokai", name: "Monokai", accent: "#a6e22e", secondary: "#66d9ef", muted: "#75715e", bg: "#272822", fg: "#f8f8f2" },
  { id: "tokyo-night", name: "Tokyo Night", accent: "#bb9af7", secondary: "#7aa2f7", muted: "#565f89", bg: "#1a1b26", fg: "#c0caf5" },
];

const ANIMATIONS = [
  "typewriter", "matrix", "glitch", "wave", "fadeIn", "scanLine",
  "decrypt", "neonGlow", "bounceIn", "slideIn", "colorCycle",
  "pixelate", "typewriterDelete", "fire", "rainbowWave",
];

interface ThemeConfig {
  lockedTheme: string;
  animation: string;
  customHexColor: string;
  gradientColor: string;
  asciiBanner: string;
}

const BANNER_TEXT = "Run Me";

function generateAscii(text: string): string[] {
  const chars: Record<string, string[]> = {
    " ": ["   ", "   ", "   ", "   ", "   "],
    R: ["█▀█", "█▀▀", "██▀", "█ █", "█ █"],
    u: ["   ", "█ █", "███", "  █", "███"],
    n: ["   ", "   ", "█▀▄", "█ █", "▀ █"],
    M: ["█   █", "█▄▄▄█", "█   █", "█   █", "█   █"],
    e: ["   ", "   ", "█▀▄", "██▄", "  ▀"],
  };
  const lines: string[] = ["", "", "", "", ""];
  for (const ch of text.toUpperCase()) {
    const glyph = chars[ch] || chars[" "];
    for (let i = 0; i < 5; i++) {
      lines[i] += (glyph[i] || "   ") + " ";
    }
  }
  return lines;
}

function ThemePreview({ config }: { config: ThemeConfig }) {
  const theme = THEMES.find((t) => t.id === config.lockedTheme) || THEMES[0];
  const accent = config.customHexColor || theme.accent;
  const gradient = config.gradientColor;
  const fg = theme.fg;
  const muted = theme.muted;
  const bg = theme.bg;
  const bannerLines = useMemo(() => generateAscii(config.asciiBanner || BANNER_TEXT), [config.asciiBanner]);

  const [visibleLines, setVisibleLines] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setVisibleLines(0);
    setAnimKey((k) => k + 1);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= bannerLines.length + 8) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [config.lockedTheme, config.customHexColor, config.gradientColor, config.asciiBanner, config.animation]);

  const menuItems = [
    "[1] About Me - Who I am and what I do",
    "[2] Projects - My work and creations",
    "[3] Experience - My professional journey",
    "[4] Skills - Technologies I work with",
    "[5] GitHub - My open source contributions",
    "[6] Contact - How to reach you",
    "[7] Hire Me - Availability and rates",
  ];

  return (
    <div
      key={animKey}
      className="rounded-lg border border-border overflow-hidden text-xs font-mono leading-relaxed"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50">
        <div className="w-2.5 h-2.5 rounded-full bg-error/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
        <span className="ml-2 text-[10px]" style={{ color: muted }}>terminal</span>
      </div>
      <div className="p-3 space-y-0.5">
        {bannerLines.map((line, i) => (
          <div
            key={i}
            className={cn("transition-opacity duration-300", visibleLines > i ? "opacity-100" : "opacity-0")}
            style={{ color: gradient ? accent : accent }}
          >
            {gradient ? (
              <span style={{
                backgroundImage: `linear-gradient(90deg, ${accent}, ${gradient})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{line}</span>
            ) : line}
          </div>
        ))}
        <div className={cn("transition-opacity duration-300", visibleLines > bannerLines.length ? "opacity-100" : "opacity-0")} style={{ color: fg }}>
          &nbsp;
        </div>
        <div className={cn("transition-opacity duration-300", visibleLines > bannerLines.length + 1 ? "opacity-100" : "opacity-0")} style={{ color: accent }}>
          ▶ RUNME
        </div>
        <div className={cn("transition-opacity duration-300", visibleLines > bannerLines.length + 2 ? "opacity-100" : "opacity-0")} style={{ color: muted }}>
          &nbsp;
        </div>
        <div className={cn("transition-opacity duration-300", visibleLines > bannerLines.length + 3 ? "opacity-100" : "opacity-0")} style={{ color: muted }}>
          ────────────────────────────────────────
        </div>
        {menuItems.map((item, i) => (
          <div
            key={i}
            className={cn("transition-opacity duration-300", visibleLines > bannerLines.length + 4 + i ? "opacity-100" : "opacity-0")}
            style={{ color: fg }}
          >
            {item}
          </div>
        ))}
        <div className={cn("transition-opacity duration-300", visibleLines > bannerLines.length + 4 + menuItems.length ? "opacity-100" : "opacity-0")} style={{ color: muted }}>
          ────────────────────────────────────────
        </div>
        <div className={cn("transition-opacity duration-300", visibleLines > bannerLines.length + 5 + menuItems.length ? "opacity-100" : "opacity-0")} style={{ color: fg }}>
          <span style={{ color: accent }}>❯</span> _
        </div>
      </div>
    </div>
  );
}

export default function ThemePage() {
  const [config, setConfig] = useState<ThemeConfig>({
    lockedTheme: "cyberpunk",
    animation: "typewriter",
    customHexColor: "",
    gradientColor: "",
    asciiBanner: "",
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
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Theme</h1>
        <p className="text-sm text-muted">
          Customize how your portfolio looks in the terminal. The preview updates live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Theme picker */}
          <div>
            <h2 className="text-xs text-muted uppercase tracking-wider mb-3">Color theme</h2>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setConfig({ ...config, lockedTheme: t.id, customHexColor: "", gradientColor: "" })}
                  className={cn(
                    "border rounded-lg p-3 text-left transition-colors",
                    config.lockedTheme === t.id && !config.customHexColor
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-muted"
                  )}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.accent }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.secondary }} />
                  </div>
                  <span className="text-sm font-medium">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom colors */}
          <div>
            <h2 className="text-xs text-muted uppercase tracking-wider mb-3">Custom color</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.customHexColor || "#3b82f6"}
                  onChange={(e) => setConfig({ ...config, customHexColor: e.target.value, lockedTheme: "" })}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={config.customHexColor}
                  onChange={(e) => setConfig({ ...config, customHexColor: e.target.value, lockedTheme: "" })}
                  placeholder="#3b82f6"
                  className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg font-mono placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors w-36"
                />
                {config.customHexColor && (
                  <button
                    onClick={() => setConfig({ ...config, customHexColor: "", gradientColor: "", lockedTheme: "cyberpunk" })}
                    className="text-xs text-muted hover:text-fg transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              {config.customHexColor && (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.gradientColor || "#8b5cf6"}
                    onChange={(e) => setConfig({ ...config, gradientColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.gradientColor}
                    onChange={(e) => setConfig({ ...config, gradientColor: e.target.value })}
                    placeholder="Gradient (optional)"
                    className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg font-mono placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors w-36"
                  />
                  <span className="text-xs text-muted">gradient end</span>
                </div>
              )}
            </div>
          </div>

          {/* Banner text */}
          <div>
            <h2 className="text-xs text-muted uppercase tracking-wider mb-3">Banner text</h2>
            <input
              type="text"
              value={config.asciiBanner}
              onChange={(e) => setConfig({ ...config, asciiBanner: e.target.value })}
              placeholder={BANNER_TEXT}
              className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg font-mono placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors w-full"
            />
            <p className="text-xs text-muted mt-1">Leave empty for default &quot;{BANNER_TEXT}&quot;</p>
          </div>

          {/* Animation picker */}
          <div>
            <h2 className="text-xs text-muted uppercase tracking-wider mb-3">Entrance animation</h2>
            <div className="grid grid-cols-2 gap-1.5">
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

        {/* Live preview */}
        <div className="lg:sticky lg:top-4 self-start">
          <h2 className="text-xs text-muted uppercase tracking-wider mb-3">Preview</h2>
          <ThemePreview config={config} />
        </div>
      </div>
    </div>
  );
}
