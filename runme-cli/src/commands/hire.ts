import chalk from "chalk";
import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";

export function showHire(data: PortfolioData, theme: ThemeColors): void {
  const colors = createThemeColors(theme);
  const { profile } = data;

  console.log();
  console.log(colors.bold("  Hire Me"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  if (profile.availableForHire) {
    console.log(`  ${colors.success("✓ Available for hire")}`);
    console.log();

    if (profile.responseTime) {
      console.log(`  ${colors.accent("Response Time:")} ${colors.fg(profile.responseTime)}`);
    }

    if (profile.timezone) {
      console.log(`  ${colors.accent("Timezone:")}      ${colors.fg(profile.timezone)}`);
    }

    console.log();
    console.log(colors.muted("  " + symbols.line.repeat(40)));
    console.log();

    if (profile.email) {
      console.log(`  ${colors.accent("How to reach me:")}`);
      console.log(`  ${colors.fg("Email:")} ${profile.email}`);
    }

    if (profile.phone) {
      console.log(`  ${colors.fg("Phone:")} ${profile.phone}`);
    }

    if (profile.portfolioUrl) {
      console.log(`  ${colors.fg("Portfolio:")} ${profile.portfolioUrl}`);
    }

    console.log();
    console.log(colors.muted("  " + symbols.line.repeat(40)));
  } else {
    console.log(`  ${colors.muted("Not available for hire at this time")}`);
    console.log();
    console.log(colors.muted("  Feel free to connect on LinkedIn or GitHub:"));

    if (profile.linkedinUrl) {
      console.log(`  ${colors.fg("LinkedIn:")} ${profile.linkedinUrl}`);
    }

    if (profile.githubUrl) {
      console.log(`  ${colors.fg("GitHub:")} ${profile.githubUrl}`);
    }
  }

  console.log();
}
