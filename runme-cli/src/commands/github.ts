import chalk from "chalk";
import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";

export function showGitHub(data: PortfolioData, theme: ThemeColors): void {
  const colors = createThemeColors(theme);
  const { github } = data;

  console.log();
  console.log(colors.bold("  GitHub"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  if (!github) {
    console.log(colors.muted("  GitHub data not available"));
    console.log();
    return;
  }

  console.log(`  ${colors.accent("Username:")}     ${colors.fg(github.username)}`);
  console.log(`  ${colors.accent("Public Repos:")} ${colors.fg(github.publicRepos.toString())}`);
  console.log(`  ${colors.accent("Followers:")}    ${colors.fg(github.followers.toString())}`);
  console.log(`  ${colors.accent("Following:")}    ${colors.fg(github.following.toString())}`);
  console.log(`  ${colors.accent("Contributions:")} ${colors.fg(github.contributions.toString())}`);

  console.log();

  if (github.topLanguages && github.topLanguages.length > 0) {
    console.log(colors.bold("  Top Languages"));
    console.log();

    github.topLanguages.slice(0, 5).forEach((lang) => {
      const barLength = Math.round(lang.percentage / 5);
      const bar = colors.accent("█".repeat(barLength)) + colors.muted("░".repeat(20 - barLength));
      console.log(`  ${colors.fg(lang.name.padEnd(12))} ${bar} ${colors.dim(`${lang.percentage}%`)}`);
    });

    console.log();
  }

  if (github.recentActivity && github.recentActivity.length > 0) {
    console.log(colors.bold("  Recent Activity"));
    console.log();

    github.recentActivity.slice(0, 5).forEach((activity) => {
      const icon = getActivityIcon(activity.type);
      console.log(`  ${icon} ${colors.fg(activity.repo)} ${colors.dim(activity.date)}`);
    });

    console.log();
  }
}

function getActivityIcon(type: string): string {
  switch (type) {
    case "push":
      return symbols.arrow;
    case "create":
      return "+";
    case "delete":
      return symbols.cross;
    case "fork":
      return "⑂";
    case "star":
      return symbols.star;
    default:
      return symbols.bullet;
  }
}
