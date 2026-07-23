import chalk from "chalk";
import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";

export function showAbout(data: PortfolioData, theme: ThemeColors): void {
  const colors = createThemeColors(theme);
  const { profile } = data;

  console.log();
  console.log(colors.bold("  About Me"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  console.log(`  ${colors.accent("Name:")}        ${colors.fg(profile.name)}`);
  console.log(`  ${colors.accent("Title:")}       ${colors.fg(profile.title)}`);
  console.log();

  if (profile.bio) {
    console.log(`  ${colors.accent("Bio:")}`);
    const words = profile.bio.split(" ");
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
  console.log(colors.muted("  " + symbols.line.repeat(40)));

  if (profile.location) {
    console.log(`  ${symbols.pin || "📍"} ${colors.fg(profile.location)}`);
  }

  if (profile.availableForHire) {
    console.log(`  ${symbols.check} ${colors.success("Available for hire")}`);
    if (profile.responseTime) {
      console.log(`    ${colors.dim("Response time: " + profile.responseTime)}`);
    }
  } else {
    console.log(`  ${symbols.cross} ${colors.error("Not available for hire")}`);
  }

  console.log();
}
