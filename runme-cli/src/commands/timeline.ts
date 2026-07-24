import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { drawContentLine, drawEmptyLine, drawSectionHeader, drawSectionFooter, drawSeparator } from "../ui/box.js";

export function showTimeline(data: PortfolioData, theme: ThemeColors): void {
  const c = createThemeColors(theme);
  const { experience } = data;

  const lines: string[] = [];

  if (experience.length === 0) {
    lines.push(drawContentLine(c.muted("No timeline data to display"), theme));
  } else {
    const sorted = [...experience].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    for (let i = 0; i < sorted.length; i++) {
      const exp = sorted[i];
      const isLast = i === sorted.length - 1;
      const connector = isLast ? "\u2514\u2500" : "\u251C\u2500";
      const marker = exp.isEducation ? c.secondary("\u25CB") : c.accent("\u25CF");

      lines.push(drawContentLine(`${c.muted(connector)} ${marker} ${c.bold(exp.position)}`, theme));
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

      if (!isLast) {
        lines.push(drawContentLine(`  ${c.muted("\u2502")}`, theme));
      }
    }
  }

  console.log();
  console.log(drawSectionHeader("Timeline", theme));
  for (const line of lines) {
    console.log(line);
  }
  console.log(drawSectionFooter(theme));
}
