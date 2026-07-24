"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
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
  bootAnimation: string;
  customHexColor: string;
  gradientColor: string;
  asciiBanner: string;
}

const BANNER_TEXT = "Run Me";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

function generateAscii(text: string): string[] {
  const font: Record<string, string[]> = {
    " ": ["    ","    ","    ","    ","    ","    ","    "],
    A: ["  ██  ","██████","██  ██","██████","██  ██","██  ██","      "],
    B: ["█████ ","██  ██","█████ ","██  ██","██  ██","█████ ","      "],
    C: [" ████ ","██    ","██    ","██    ","██    "," ████ ","      "],
    D: ["████  ","██  ██","██  ██","██  ██","██  ██","████  ","      "],
    E: ["██████","██    ","█████ ","██    ","██    ","██████","      "],
    F: ["██████","██    ","█████ ","██    ","██    ","██    ","      "],
    G: [" ████ ","██    ","██ ███","██  ██","██  ██"," ████ ","      "],
    H: ["██  ██","██  ██","██████","██  ██","██  ██","██  ██","      "],
    I: ["██████","  ██  ","  ██  ","  ██  ","  ██  ","██████","      "],
    J: ["██████","    ██","    ██","    ██","██  ██"," ████ ","      "],
    K: ["██  ██","██ ██ ","████  ","██ ██ ","██  ██","██  ██","      "],
    L: ["██    ","██    ","██    ","██    ","██    ","██████","      "],
    M: ["██   ██","███ ███","██ █ ██","██   ██","██   ██","██   ██","       "],
    N: ["██  ██","███ ██","██████","██ ███","██  ██","██  ██","       "],
    O: [" ████ ","██  ██","██  ██","██  ██","██  ██"," ████ ","      "],
    P: ["█████ ","██  ██","█████ ","██    ","██    ","██    ","      "],
    Q: [" ████ ","██  ██","██  ██","██ ███","██  ██"," ████ ","      "],
    R: ["█████ ","██  ██","█████ ","██ ██ ","██  ██","██  ██","      "],
    S: [" ████ ","██    "," ███  ","    ██","    ██","████  ","      "],
    T: ["██████","  ██  ","  ██  ","  ██  ","  ██  ","  ██  ","      "],
    U: ["██  ██","██  ██","██  ██","██  ██","██  ██"," ████ ","      "],
    V: ["██  ██","██  ██","██  ██","██  ██"," ████ ","  ██  ","      "],
    W: ["██   ██","██   ██","██   ██","██ █ ██","███ ███","██   ██","       "],
    X: ["██  ██"," ████ ","  ██  "," ████ ","██  ██","██  ██","      "],
    Y: ["██  ██"," ████ ","  ██  ","  ██  ","  ██  ","  ██  ","      "],
    Z: ["██████","    ██","  ██  "," ██   ","██    ","██████","      "],
    0: [" ████ ","██  ██","██  ██","██  ██","██  ██"," ████ ","      "],
    1: ["  ██  "," ███  ","  ██  ","  ██  ","  ██  ","██████","      "],
    2: [" ████ ","██  ██","    ██","  ███ ","██    ","██████","      "],
    3: [" ████ ","██  ██","  ███ ","    ██","██  ██"," ████ ","      "],
    4: ["██  ██","██  ██","██████","    ██","    ██","    ██","      "],
    5: ["██████","██    ","█████ ","    ██","██  ██"," ████ ","      "],
    6: [" ████ ","██    ","█████ ","██  ██","██  ██"," ████ ","      "],
    7: ["██████","    ██","   ██ ","  ██  ","  ██  ","  ██  ","      "],
    8: [" ████ ","██  ██"," ████ ","██  ██","██  ██"," ████ ","      "],
    9: [" ████ ","██  ██"," █████","    ██","    ██"," ████ ","      "],
  };
  const lines: string[] = ["","","","","","",""];
  for (const ch of text) {
    const glyph = font[ch] || font[ch.toUpperCase()] || font[" "];
    for (let i = 0; i < 7; i++) {
      lines[i] += (glyph[i] || "      ") + " ";
    }
  }
  return lines;
}

function scrambleText(text: string, progress: number): string {
  return text.split("").map((ch, i) => {
    if (ch === " ") return " ";
    const threshold = i / text.length;
    if (progress > threshold + 0.3) return ch;
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }).join("");
}

const rainbowColors = ["#ff0000","#ff7700","#ffff00","#00ff00","#0077ff","#8800ff","#ff00ff"];

function ThemePreview({ config }: { config: ThemeConfig }) {
  const theme = THEMES.find((t) => t.id === config.lockedTheme) || THEMES[0];
  const accent = config.customHexColor || theme.accent;
  const gradient = config.gradientColor;
  const fg = theme.fg;
  const muted = theme.muted;
  const bg = theme.bg;
  const bannerLines = useMemo(() => generateAscii(config.asciiBanner || BANNER_TEXT), [config.asciiBanner]);
  const anim = config.bootAnimation;

  const totalLines = bannerLines.length + 5 + 7;
  const [tick, setTick] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [glitchOffset, setGlitchOffset] = useState(0);

  useEffect(() => {
    setTick(0);
    setAnimKey((k) => k + 1);
    let t = 0;
    const speed = anim === "matrix" ? 60 : anim === "wave" ? 100 : 80;
    const interval = setInterval(() => {
      t++;
      setTick(t);
      if (t > totalLines + 10) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [anim, config.lockedTheme, config.customHexColor, config.gradientColor, config.asciiBanner]);

  useEffect(() => {
    if (anim !== "glitch") return;
    const interval = setInterval(() => {
      setGlitchOffset(Math.random() > 0.7 ? (Math.random() * 6 - 3) : 0);
    }, 100);
    return () => clearInterval(interval);
  }, [anim]);

  const getLineVisible = useCallback((lineIndex: number): boolean => {
    switch (anim) {
      case "typewriter": return tick > lineIndex * 2;
      case "matrix": return tick > lineIndex * 1.5;
      case "wave": {
        const wave = Math.sin((tick - lineIndex) * 0.5);
        return tick > lineIndex * 1.8 && wave > -0.3;
      }
      case "fadeIn": return tick > 5;
      case "scanLine": {
        const scanPos = (tick * 3) % (totalLines + 10);
        return lineIndex < scanPos;
      }
      case "decrypt": return tick > lineIndex * 2;
      case "neonGlow": return tick > lineIndex * 1.5;
      case "bounceIn": return tick > lineIndex * 1.2;
      case "slideIn": return tick > lineIndex * 1.5;
      case "colorCycle": return tick > lineIndex * 2;
      case "pixelate": return tick > lineIndex * 2;
      case "typewriterDelete": return tick > lineIndex * 2 && tick < totalLines + 8;
      case "fire": return tick > lineIndex * 1.5;
      case "rainbowWave": return tick > lineIndex * 2;
      default: return tick > lineIndex * 2;
    }
  }, [tick, anim, totalLines]);

  const getLineStyle = useCallback((lineIndex: number): React.CSSProperties => {
    const base: React.CSSProperties = {};

    switch (anim) {
      case "typewriter":
        base.transition = "opacity 0.1s";
        break;
      case "matrix":
        base.transition = "opacity 0.15s, color 0.3s";
        break;
      case "wave":
        base.transition = `transform 0.3s ease ${(lineIndex * 0.05)}s, opacity 0.3s`;
        if (!getLineVisible(lineIndex)) base.transform = "translateY(10px)";
        break;
      case "fadeIn":
        base.transition = `opacity 0.6s ease ${(lineIndex * 0.1)}s`;
        break;
      case "scanLine":
        base.transition = "opacity 0.05s";
        break;
      case "decrypt":
        base.transition = "opacity 0.2s";
        break;
      case "neonGlow":
        if (getLineVisible(lineIndex)) {
          base.textShadow = `0 0 8px ${accent}, 0 0 16px ${accent}40`;
          base.transition = "text-shadow 0.5s, opacity 0.3s";
        }
        break;
      case "bounceIn": {
        const bounce = getLineVisible(lineIndex) ? "translateY(0)" : "translateY(-20px)";
        base.transition = `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${(lineIndex * 0.06)}s`;
        if (!getLineVisible(lineIndex)) base.transform = bounce;
        break;
      }
      case "slideIn":
        base.transition = `transform 0.3s ease ${(lineIndex * 0.06)}s, opacity 0.3s`;
        if (!getLineVisible(lineIndex)) { base.transform = "translateX(-30px)"; base.opacity = 0; }
        break;
      case "colorCycle":
        if (getLineVisible(lineIndex)) {
          const colorIdx = Math.floor((tick * 0.3 + lineIndex) % rainbowColors.length);
          base.color = rainbowColors[colorIdx];
        }
        break;
      case "pixelate":
        base.transition = "opacity 0.2s";
        if (getLineVisible(lineIndex) && tick < lineIndex * 2 + 8) {
          base.filter = `blur(${Math.max(0, 4 - (tick - lineIndex * 2))}px)`;
        }
        break;
      case "typewriterDelete":
        base.transition = "opacity 0.1s";
        break;
      case "fire":
        if (getLineVisible(lineIndex)) {
          base.textShadow = `0 0 6px #ff4400, 0 0 12px #ff220060`;
          const flicker = Math.random() > 0.5 ? 1 : 0.85;
          base.opacity = flicker;
        }
        break;
      case "rainbowWave":
        if (getLineVisible(lineIndex)) {
          const colorIdx = Math.floor((lineIndex + tick * 0.2) % rainbowColors.length);
          base.color = rainbowColors[colorIdx];
          base.transition = "color 0.2s";
        }
        break;
      case "glitch":
        if (getLineVisible(lineIndex)) {
          base.transition = "transform 0.05s";
          if (Math.random() > 0.9) base.transform = `translateX(${Math.random() * 4 - 2}px)`;
        }
        break;
    }
    return base;
  }, [anim, tick, accent, getLineVisible]);

  const getMenuText = useCallback((lineIndex: number, text: string): string => {
    if (!getLineVisible(lineIndex)) return "";
    if (anim === "decrypt") {
      const progress = Math.min(1, Math.max(0, (tick - lineIndex * 2) / 8));
      return scrambleText(text, progress);
    }
    if (anim === "typewriterDelete") {
      const phase = tick - lineIndex * 2;
      if (phase < 0) return "";
      if (phase < text.length) return text.slice(0, phase);
      const deleteStart = totalLines;
      if (tick > deleteStart + lineIndex) {
        const deleted = Math.min(text.length, tick - deleteStart - lineIndex);
        return text.slice(0, text.length - deleted);
      }
      return text;
    }
    if (anim === "matrix") {
      const age = tick - lineIndex * 1.5;
      if (age < 3) return text.split("").map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
      return text;
    }
    return text;
  }, [anim, tick, getLineVisible, totalLines]);

  const getBannerText = useCallback((lineIndex: number, line: string): string => {
    if (!getLineVisible(lineIndex)) return "";
    if (anim === "matrix") {
      const age = tick - lineIndex * 1.5;
      if (age < 5) return line.replace(/./g, () => CHARS[Math.floor(Math.random() * CHARS.length)]);
    }
    if (anim === "decrypt") {
      const progress = Math.min(1, Math.max(0, (tick - lineIndex * 2) / 10));
      return line.replace(/[^\s]/g, (ch, offset) => {
        const charThreshold = offset / line.length;
        if (progress > charThreshold + 0.4) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });
    }
    return line;
  }, [anim, tick, getLineVisible]);

  const menuItems = [
    "[1] About Me - Who I am and what I do",
    "[2] Projects - My work and creations",
    "[3] Experience - My professional journey",
    "[4] Skills - Technologies I work with",
    "[5] GitHub - My open source contributions",
    "[6] Contact - How to reach you",
    "[7] Hire Me - Availability and rates",
  ];

  const allContent = [
    ...bannerLines.map((_, i) => ({ type: "banner" as const, index: i })),
    { type: "space" as const, index: bannerLines.length },
    { type: "runme" as const, index: bannerLines.length + 1 },
    { type: "space2" as const, index: bannerLines.length + 2 },
    { type: "line" as const, index: bannerLines.length + 3 },
    ...menuItems.map((_, i) => ({ type: "menu" as const, index: bannerLines.length + 4 + i })),
    { type: "line2" as const, index: bannerLines.length + 4 + menuItems.length },
    { type: "input" as const, index: bannerLines.length + 5 + menuItems.length },
  ];

  const renderLine = (item: typeof allContent[0]) => {
    const visible = getLineVisible(item.index);
    const lineStyle = getLineStyle(item.index);
    const opacity = visible ? 1 : 0;

    switch (item.type) {
      case "banner":
        return (
          <div key={item.index} style={{ ...lineStyle, color: accent, opacity, whiteSpace: "pre" }}>
            {gradient ? (
              <span style={{
                backgroundImage: `linear-gradient(90deg, ${accent}, ${gradient})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{getBannerText(item.index, bannerLines[item.index])}</span>
            ) : getBannerText(item.index, bannerLines[item.index])}
          </div>
        );
      case "space":
        return <div key={item.index} style={{ opacity }}>&nbsp;</div>;
      case "runme":
        return <div key={item.index} style={{ ...lineStyle, color: accent, opacity }}>▶ RUNME</div>;
      case "space2":
        return <div key={item.index} style={{ opacity }}>&nbsp;</div>;
      case "line":
      case "line2":
        return <div key={item.index} style={{ ...lineStyle, color: muted, opacity }}>────────────────────────────────────────</div>;
      case "menu":
        const menuIdx = item.index - bannerLines.length - 4;
        return (
          <div key={item.index} style={{ ...lineStyle, color: fg, opacity, whiteSpace: "pre" }}>
            {getMenuText(item.index, menuItems[menuIdx])}
          </div>
        );
      case "input":
        return (
          <div key={item.index} style={{ opacity }}>
            <span style={{ color: accent }}>❯</span>{" "}
            <span style={{ color: fg }}>{anim === "typewriter" && tick > item.index ? "_" : ""}</span>
          </div>
        );
    }
  };

  return (
    <div
      key={animKey}
      className="rounded-lg border border-border overflow-hidden text-sm font-mono leading-snug"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/50">
        <div className="w-3 h-3 rounded-full bg-error/60" />
        <div className="w-3 h-3 rounded-full bg-warning/60" />
        <div className="w-3 h-3 rounded-full bg-success/60" />
        <span className="ml-2 text-xs" style={{ color: muted }}>terminal</span>
      </div>
      <div className="p-5 space-y-1" style={{ transform: anim === "glitch" ? `translateX(${glitchOffset}px)` : undefined, minHeight: "420px" }}>
        {allContent.map(renderLine)}
      </div>
    </div>
  );
}

export default function ThemePage() {
  const [config, setConfig] = useState<ThemeConfig>({
    lockedTheme: "cyberpunk",
    bootAnimation: "typewriter",
    customHexColor: "",
    gradientColor: "",
    asciiBanner: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.theme
      .get()
      .then((res) => setConfig((prev) => ({ ...prev, ...res })))
      .catch((err) => console.error("Failed to load theme:", err));
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
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Theme</h1>
        <p className="text-sm text-muted">
          Customize how your portfolio looks in the terminal. The preview updates live.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
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
                  placeholder="#8b5cf6"
                  className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-fg font-mono placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors w-36"
                />
                <span className="text-xs text-muted">gradient end</span>
                {config.gradientColor && (
                  <button
                    onClick={() => setConfig({ ...config, gradientColor: "" })}
                    className="text-xs text-muted hover:text-fg transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
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
                  onClick={() => setConfig({ ...config, bootAnimation: a })}
                  className={cn(
                    "border rounded-md px-3 py-2 text-sm text-left transition-colors font-mono",
                    config.bootAnimation === a
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
        <div>
          <h2 className="text-xs text-muted uppercase tracking-wider mb-3">Preview</h2>
          <ThemePreview config={config} />
        </div>
      </div>
    </div>
  );
}
