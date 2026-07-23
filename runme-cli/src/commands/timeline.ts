import chalk from "chalk";
import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";

export function showTimeline(data: PortfolioData, theme: ThemeColors): void {
  const colors = createThemeColors(theme);
  const { experience } = data;

  console.log();
  console.log(colors.bold("  Timeline"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  if (experience.length === 0) {
    console.log(colors.muted("  No timeline data to display"));
    console.log();
    return;
  }

  const sorted = [...experience].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  sorted.forEach((exp, index) => {
    const isLast = index === sorted.length - 1;
    const connector = isLast ? "  " : "  │";
    const marker = exp.isEducation ? colors.secondary("○") : colors.accent("●");

    console.log(`${connector}`);
    console.log(`  ${marker} ${colors.bold(exp.role)}`);
    console.log(`  ${colors.fg(exp.company)}`);
    console.log(`  ${colors.muted(`${exp.startDate} - ${exp.endDate || "Present"}`)}`);

    if (exp.location) {
      console.log(`  ${colors.dim(exp.location)}`);
    }

    if (exp.description) {
      const words = exp.description.split(" ");
      let line = "  ";
      for (const word of words) {
        if (line.length + word.length > 50) {
          console.log(colors.fg(line));
          line = "  " + word + " ";
        } else {
          line += word + " ";
        }
      }
      if (line.trim()) {
        console.log(colors.fg(line));
      }
    }
  });

  console.log();
}
