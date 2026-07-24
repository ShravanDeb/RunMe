import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { drawContentLine, drawEmptyLine, drawSectionHeader, drawSectionFooter, drawSkillBar, drawSeparator } from "../ui/box.js";

export function showSkills(data: PortfolioData, theme: ThemeColors): void {
  const c = createThemeColors(theme);
  const { skills } = data;

  const lines: string[] = [];

  if (skills.length === 0) {
    lines.push(drawContentLine(c.muted("No skills to display"), theme));
  } else {
    for (let i = 0; i < skills.length; i++) {
      const category = skills[i];
      const levelBar = drawSkillBar(category.skillLevel, theme);
      lines.push(drawContentLine(`${c.accent(symbols.diamond)} ${c.bold(category.categoryName)}  ${levelBar}`, theme));

      if (category.skills.length > 0) {
        const tags = category.skills.map((s) => c.fg(s)).join(` ${c.muted("/")} `);
        lines.push(drawContentLine(`  ${tags}`, theme));
      }

      if (i < skills.length - 1) {
        lines.push(drawSeparator(theme));
      }
    }
  }

  console.log();
  console.log(drawSectionHeader("Skills", theme));
  for (const line of lines) {
    console.log(line);
  }
  console.log(drawSectionFooter(theme));
}
