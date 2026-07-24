import chalk from "chalk";
import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors, hexToRgb } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { drawContentLine, drawEmptyLine, drawSectionHeader, drawSectionFooter, drawSeparator } from "../ui/box.js";

export function showProjects(data: PortfolioData, theme: ThemeColors): void {
  const c = createThemeColors(theme);
  const { projects } = data;

  const lines: string[] = [];

  if (projects.length === 0) {
    lines.push(drawContentLine(c.muted("No projects to display"), theme));
  } else {
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      const num = c.accent(`[${i + 1}]`);

      let titleStyle = c.bold;
      if (project.projectColor) {
        const rgb = hexToRgb(project.projectColor);
        if (rgb) titleStyle = chalk.bold.rgb(rgb.r, rgb.g, rgb.b);
      }

      lines.push(drawContentLine(`${num} ${titleStyle(project.title)}`, theme));

      if (project.subtitle) {
        lines.push(drawContentLine(`    ${c.muted(project.subtitle)}`, theme));
      }

      if (project.description) {
        const words = project.description.split(" ");
        let line = "";
        for (const word of words) {
          if ((line + " " + word).trim().length > 34) {
            lines.push(drawContentLine(`    ${c.fg(line.trim())}`, theme));
            line = word;
          } else {
            line += (line ? " " : "") + word;
          }
        }
        if (line.trim()) {
          lines.push(drawContentLine(`    ${c.fg(line.trim())}`, theme));
        }
      }

      if (project.tags && project.tags.length > 0) {
        const tags = project.tags.map((t) => c.secondary(`#${t}`)).join(" ");
        lines.push(drawContentLine(`    ${tags}`, theme));
      }

      if (project.githubRepoUrl) {
        lines.push(drawContentLine(`    ${c.accent("Repo:")} ${c.fg(project.githubRepoUrl)}`, theme));
      }

      if (project.liveDemoUrl) {
        lines.push(drawContentLine(`    ${c.accent("Live:")} ${c.fg(project.liveDemoUrl)}`, theme));
      }

      if (i < projects.length - 1) {
        lines.push(drawSeparator(theme));
      }
    }
  }

  console.log();
  console.log(drawSectionHeader("Projects", theme));
  for (const line of lines) {
    console.log(line);
  }
  console.log(drawSectionFooter(theme));
}
