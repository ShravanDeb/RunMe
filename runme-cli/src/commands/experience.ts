import chalk from "chalk";
import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";

export function showExperience(data: PortfolioData, theme: ThemeColors): void {
  const colors = createThemeColors(theme);
  const { experience } = data;

  console.log();
  console.log(colors.bold("  Experience"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  if (experience.length === 0) {
    console.log(colors.muted("  No experience to display"));
    console.log();
    return;
  }

  const work = experience.filter((e) => !e.isEducation);
  const education = experience.filter((e) => e.isEducation);

  if (work.length > 0) {
    console.log(colors.bold("  Work Experience"));
    console.log();

    work.forEach((exp) => {
      console.log(`  ${colors.accent(symbols.bullet)} ${colors.bold(exp.role)}`);
      console.log(`    ${colors.fg(exp.company)}`);
      console.log(`    ${colors.muted(`${exp.startDate} - ${exp.endDate || "Present"}`)}`);

      if (exp.location) {
        console.log(`    ${colors.dim(exp.location)}`);
      }

      if (exp.description) {
        const words = exp.description.split(" ");
        let line = "    ";
        for (const word of words) {
          if (line.length + word.length > 50) {
            console.log(colors.fg(line));
            line = "    " + word + " ";
          } else {
            line += word + " ";
          }
        }
        if (line.trim()) {
          console.log(colors.fg(line));
        }
      }

      console.log();
    });
  }

  if (education.length > 0) {
    console.log(colors.bold("  Education"));
    console.log();

    education.forEach((edu) => {
      console.log(`  ${colors.accent(symbols.bullet)} ${colors.bold(edu.role)}`);
      console.log(`    ${colors.fg(edu.company)}`);
      console.log(`    ${colors.muted(`${edu.startDate} - ${edu.endDate || "Present"}`)}`);

      if (edu.location) {
        console.log(`    ${colors.dim(edu.location)}`);
      }

      if (edu.description) {
        const words = edu.description.split(" ");
        let line = "    ";
        for (const word of words) {
          if (line.length + word.length > 50) {
            console.log(colors.fg(line));
            line = "    " + word + " ";
          } else {
            line += word + " ";
          }
        }
        if (line.trim()) {
          console.log(colors.fg(line));
        }
      }

      console.log();
    });
  }
}
