import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { drawContentLine, drawEmptyLine, drawSectionHeader, drawSectionFooter, drawSeparator } from "../ui/box.js";

export function showExperience(data: PortfolioData, theme: ThemeColors): void {
  const c = createThemeColors(theme);
  const { experience } = data;

  const lines: string[] = [];

  if (experience.length === 0) {
    lines.push(drawContentLine(c.muted("No experience to display"), theme));
  } else {
    const work = experience.filter((e) => !e.isEducation);
    const education = experience.filter((e) => e.isEducation);

    let idx = 0;
    for (const exp of work) {
      lines.push(drawContentLine(`${c.accent(symbols.bullet)} ${c.bold(exp.position)}`, theme));
      lines.push(drawContentLine(`  ${c.fg(exp.company)}`, theme));
      lines.push(drawContentLine(`  ${c.muted(`${exp.startDate} - ${exp.endDate || "Present"}`)}`, theme));
      if (exp.location) {
        lines.push(drawContentLine(`  ${c.dim(exp.location)}`, theme));
      }
      if (exp.description) {
        const words = exp.description.split(" ");
        let line = "";
        for (const word of words) {
          if ((line + " " + word).trim().length > 36) {
            lines.push(drawContentLine(`  ${c.fg(line.trim())}`, theme));
            line = word;
          } else {
            line += (line ? " " : "") + word;
          }
        }
        if (line.trim()) {
          lines.push(drawContentLine(`  ${c.fg(line.trim())}`, theme));
        }
      }
      idx++;
      if (idx < work.length || education.length > 0) {
        lines.push(drawSeparator(theme));
      }
    }

    idx = 0;
    for (const edu of education) {
      lines.push(drawContentLine(`${c.secondary(symbols.diamond)} ${c.bold(edu.position)}`, theme));
      lines.push(drawContentLine(`  ${c.fg(edu.company)}`, theme));
      lines.push(drawContentLine(`  ${c.muted(`${edu.startDate} - ${edu.endDate || "Present"}`)}`, theme));
      if (edu.location) {
        lines.push(drawContentLine(`  ${c.dim(edu.location)}`, theme));
      }
      if (edu.description) {
        const words = edu.description.split(" ");
        let line = "";
        for (const word of words) {
          if ((line + " " + word).trim().length > 36) {
            lines.push(drawContentLine(`  ${c.fg(line.trim())}`, theme));
            line = word;
          } else {
            line += (line ? " " : "") + word;
          }
        }
        if (line.trim()) {
          lines.push(drawContentLine(`  ${c.fg(line.trim())}`, theme));
        }
      }
      idx++;
      if (idx < education.length) {
        lines.push(drawEmptyLine(theme));
      }
    }
  }

  console.log();
  console.log(drawSectionHeader("Experience", theme));
  for (const line of lines) {
    console.log(line);
  }
  console.log(drawSectionFooter(theme));
}
