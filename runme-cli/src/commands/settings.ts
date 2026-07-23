import chalk from "chalk";
import { ThemeColors, ThemeName } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { getThemeNames } from "../ui/themes.js";
import { loadConfig, saveConfig } from "../services/config.service.js";

export function showSettings(theme: ThemeColors): void {
  const colors = createThemeColors(theme);
  const config = loadConfig();

  console.log();
  console.log(colors.bold("  Settings"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  console.log(`  ${colors.accent("Current Theme:")} ${colors.fg(config.theme || "cyberpunk")}`);
  console.log(`  ${colors.accent("Animation:")}     ${colors.fg(config.animation || "typewriter")}`);
  console.log();

  console.log(colors.bold("  Available Themes:"));
  console.log();

  const themes = getThemeNames();
  themes.forEach((t) => {
    const marker = config.theme === t ? colors.success(symbols.check) : " ";
    console.log(`  ${marker} ${colors.fg(t)}`);
  });

  console.log();
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log(colors.dim("  Use 'runme theme <name>' to change theme"));
  console.log(colors.dim("  Use 'runme animation <name>' to change animation"));
  console.log();
}

export function setTheme(themeName: ThemeName, currentTheme: ThemeColors): void {
  const colors = createThemeColors(currentTheme);
  const config = loadConfig();
  config.theme = themeName;
  saveConfig(config);
  console.log(`\n  ${colors.success("✓")} Theme set to ${colors.fg(themeName)}\n`);
}

export function setAnimation(animation: string, currentTheme: ThemeColors): void {
  const colors = createThemeColors(currentTheme);
  const config = loadConfig();
  config.animation = animation;
  saveConfig(config);
  console.log(`\n  ${colors.success("✓")} Animation set to ${colors.fg(animation)}\n`);
}
