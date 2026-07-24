import { ThemeColors, ThemeName } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { getThemeNames } from "../ui/themes.js";
import { loadConfig, saveConfig } from "../services/config.service.js";
import { drawContentLine, drawEmptyLine, drawSectionHeader, drawSectionFooter, drawSeparator } from "../ui/box.js";

export function showSettings(theme: ThemeColors): void {
  const c = createThemeColors(theme);
  const config = loadConfig();

  const lines: string[] = [];
  lines.push(drawContentLine(`${c.accent("Theme:")}     ${c.fg(config.theme || "cyberpunk")}`, theme));
  lines.push(drawContentLine(`${c.accent("Animation:")} ${c.fg(config.animation || "typewriter")}`, theme));

  lines.push(drawEmptyLine(theme));

  const themes = getThemeNames();
  for (const t of themes) {
    const marker = config.theme === t ? c.success(symbols.check) : " ";
    lines.push(drawContentLine(`  ${marker} ${c.fg(t)}`, theme));
  }

  lines.push(drawSeparator(theme));
  lines.push(drawContentLine(`${c.dim("runme theme <name>")}  ${c.dim("runme animation <name>")}`, theme));

  console.log();
  console.log(drawSectionHeader("Settings", theme));
  for (const line of lines) {
    console.log(line);
  }
  console.log(drawSectionFooter(theme));
}

export function setTheme(themeName: ThemeName, currentTheme: ThemeColors): void {
  const colors = createThemeColors(currentTheme);
  const config = loadConfig();
  config.theme = themeName;
  saveConfig(config);
  console.log(`\n  ${colors.success(symbols.check)} Theme set to ${colors.fg(themeName)}\n`);
}

export function setAnimation(animation: string, currentTheme: ThemeColors): void {
  const colors = createThemeColors(currentTheme);
  const config = loadConfig();
  config.animation = animation;
  saveConfig(config);
  console.log(`\n  ${colors.success(symbols.check)} Animation set to ${colors.fg(animation)}\n`);
}
