import chalk from "chalk";
import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

export function showProjects(data: PortfolioData, theme: ThemeColors): void {
  const colors = createThemeColors(theme);
  const { projects } = data;

  console.log();
  console.log(colors.bold("  Projects"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  if (projects.length === 0) {
    console.log(colors.muted("  No projects to display"));
    console.log();
    return;
  }

  projects.forEach((project, index) => {
    const num = colors.accent(`[${index + 1}]`);
    let titleColor = colors.bold;
    if (project.projectColor) {
      const rgb = hexToRgb(project.projectColor);
      if (rgb) titleColor = chalk.bold.rgb(rgb.r, rgb.g, rgb.b);
    }
    console.log(`  ${num} ${titleColor(project.title)}`);

    if (project.subtitle) {
      console.log(`      ${colors.muted(project.subtitle)}`);
    }

    if (project.description) {
      const words = project.description.split(" ");
      let line = "      ";
      for (const word of words) {
        if (line.length + word.length > 50) {
          console.log(colors.fg(line));
          line = "      " + word + " ";
        } else {
          line += word + " ";
        }
      }
      if (line.trim()) {
        console.log(colors.fg(line));
      }
    }

    if (project.tags && project.tags.length > 0) {
      const tags = project.tags.map((t) => colors.secondary(`#${t}`)).join(" ");
      console.log(`      ${tags}`);
    }

    if (project.liveDemoUrl) {
      console.log(`      ${colors.accent("Live:")} ${colors.fg(project.liveDemoUrl)}`);
    }

    if (project.githubRepoUrl) {
      console.log(`      ${colors.accent("Repo:")} ${colors.fg(project.githubRepoUrl)}`);
    }

    console.log();
  });
}
