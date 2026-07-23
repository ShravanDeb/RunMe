import chalk from "chalk";
import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";

export function showSkills(data: PortfolioData, theme: ThemeColors): void {
  const colors = createThemeColors(theme);
  const { skills } = data;

  console.log();
  console.log(colors.bold("  Skills"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  if (skills.length === 0) {
    console.log(colors.muted("  No skills to display"));
    console.log();
    return;
  }

  skills.forEach((category) => {
    console.log(`  ${colors.accent(symbols.diamond)} ${colors.bold(category.categoryName)}`);

    if (category.description) {
      console.log(`    ${colors.muted(category.description)}`);
    }

    const levelBar = getLevelBar(category.skillLevel, theme);
    console.log(`    ${colors.dim("Level:")} ${levelBar}`);

    if (category.skills.length > 0) {
      const skillsList = category.skills.map((s) => colors.fg(s)).join(", ");
      console.log(`    ${skillsList}`);
    }

    console.log();
  });
}

function getLevelBar(level: string, theme: ThemeColors): string {
  const levels: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };

  const filled = levels[level] || 0;
  const total = 4;
  const colors = createThemeColors(theme);

  let bar = "";
  for (let i = 0; i < total; i++) {
    if (i < filled) {
      bar += colors.accent("█");
    } else {
      bar += colors.muted("░");
    }
  }

  return `${bar} ${colors.dim(level)}`;
}
