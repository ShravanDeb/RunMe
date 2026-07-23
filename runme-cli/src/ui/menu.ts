import chalk from "chalk";
import { ThemeColors } from "../types/index.js";
import { createThemeColors } from "./colors.js";
import { symbols } from "./symbols.js";

export interface MenuItem {
  id: string;
  label: string;
  description: string;
}

export const defaultMenuItems: MenuItem[] = [
  { id: "about", label: "About Me", description: "Who I am and what I do" },
  { id: "projects", label: "Projects", description: "My work and creations" },
  { id: "experience", label: "Experience", description: "My professional journey" },
  { id: "skills", label: "Skills", description: "Technologies I work with" },
  { id: "github", label: "GitHub", description: "My open source contributions" },
  { id: "contact", label: "Contact", description: "How to reach me" },
  { id: "hire", label: "Hire Me", description: "Availability and rates" },
  { id: "timeline", label: "Timeline", description: "Career milestones" },
  { id: "settings", label: "Settings", description: "Theme and preferences" },
];

export function renderMenu(items: MenuItem[], theme: ThemeColors): void {
  const colors = createThemeColors(theme);

  console.log();
  console.log(colors.bold("  Available Commands:"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  items.forEach((item, index) => {
    const num = colors.accent(`[${index + 1}]`);
    const label = colors.fg(item.label);
    const desc = colors.muted(` - ${item.description}`);
    console.log(`  ${num} ${label}${desc}`);
  });

  console.log();
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log(colors.dim("  Type a number or command name, or 'quit' to exit"));
  console.log();
}

export function renderPrompt(theme: ThemeColors): void {
  const colors = createThemeColors(theme);
  process.stdout.write(colors.accent("  ▸ ") + colors.fg("Select: "));
}
