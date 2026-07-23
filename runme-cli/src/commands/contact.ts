import chalk from "chalk";
import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";

export function showContact(data: PortfolioData, theme: ThemeColors): void {
  const colors = createThemeColors(theme);
  const { profile } = data;

  console.log();
  console.log(colors.bold("  Contact"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  if (profile.email) {
    console.log(`  ${colors.accent("Email:")}     ${colors.fg(profile.email)}`);
  }

  if (profile.phone) {
    console.log(`  ${colors.accent("Phone:")}     ${colors.fg(profile.phone)}`);
  }

  if (profile.githubUrl) {
    console.log(`  ${colors.accent("GitHub:")}    ${colors.fg(profile.githubUrl)}`);
  }

  if (profile.linkedinUrl) {
    console.log(`  ${colors.accent("LinkedIn:")}  ${colors.fg(profile.linkedinUrl)}`);
  }

  if (profile.portfolioUrl) {
    console.log(`  ${colors.accent("Portfolio:")} ${colors.fg(profile.portfolioUrl)}`);
  }

  if (profile.timezone) {
    console.log(`  ${colors.accent("Timezone:")} ${colors.fg(profile.timezone)}`);
  }

  console.log();
  console.log(colors.muted("  " + symbols.line.repeat(40)));

  if (profile.availableForHire) {
    console.log(`  ${colors.success("✓ Available for hire")}`);
    if (profile.responseTime) {
      console.log(`    ${colors.dim("Typical response time: " + profile.responseTime)}`);
    }
  } else {
    console.log(`  ${colors.muted("Not available for hire at this time")}`);
  }

  console.log();
}
