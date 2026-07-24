import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { drawContentLine, drawEmptyLine, drawSectionHeader, drawSectionFooter, drawProgressBar, drawSeparator } from "../ui/box.js";

export function showGitHub(data: PortfolioData, theme: ThemeColors): void {
  const c = createThemeColors(theme);
  const { github } = data;

  const lines: string[] = [];

  if (!github) {
    lines.push(drawContentLine(c.muted("GitHub data not available"), theme));
  } else {
    lines.push(drawContentLine(`${c.accent(symbols.user)} ${c.bold(github.username)}`, theme));
    lines.push(drawSeparator(theme));

    const stats = [
      { label: "Repos", value: github.publicRepos.toString() },
      { label: "Followers", value: github.followers.toString() },
      { label: "Following", value: github.following.toString() },
      { label: "Contributions", value: github.contributions.toString() },
    ];

    for (const stat of stats) {
      lines.push(drawContentLine(`${c.dim(stat.label + ":")} ${c.fg(stat.value)}`, theme));
    }

    if (github.topLanguages && github.topLanguages.length > 0) {
      lines.push(drawEmptyLine(theme));
      lines.push(drawContentLine(c.bold("Top Languages"), theme));
      for (const lang of github.topLanguages.slice(0, 5)) {
        const bar = drawProgressBar(lang.percentage, 100, theme, 20);
        lines.push(drawContentLine(`  ${c.fg(lang.name.padEnd(10))} ${bar}`, theme));
      }
    }

    if (github.recentActivity && github.recentActivity.length > 0) {
      lines.push(drawEmptyLine(theme));
      lines.push(drawContentLine(c.bold("Recent Activity"), theme));
      for (const activity of github.recentActivity.slice(0, 5)) {
        const icon = getActivityIcon(activity.type);
        lines.push(drawContentLine(`  ${icon} ${c.fg(activity.repo)} ${c.dim(activity.date)}`, theme));
      }
    }
  }

  console.log();
  console.log(drawSectionHeader("GitHub", theme));
  for (const line of lines) {
    console.log(line);
  }
  console.log(drawSectionFooter(theme));
}

function getActivityIcon(type: string): string {
  switch (type) {
    case "push": return symbols.arrow;
    case "create": return "+";
    case "delete": return symbols.cross;
    case "fork": return "\u2442";
    case "star": return symbols.star;
    default: return symbols.bullet;
  }
}
