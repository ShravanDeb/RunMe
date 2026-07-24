import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { drawContentLine, drawEmptyLine, drawSectionHeader, drawSectionFooter, drawSeparator } from "../ui/box.js";

export function showContact(data: PortfolioData, theme: ThemeColors): void {
  const c = createThemeColors(theme);
  const { profile } = data;

  const lines: string[] = [];

  if (profile.email) lines.push(drawContentLine(`${c.accent("Email:")}    ${c.fg(profile.email)}`, theme));
  if (profile.phone) lines.push(drawContentLine(`${c.accent("Phone:")}    ${c.fg(profile.phone)}`, theme));
  if (profile.github) lines.push(drawContentLine(`${c.accent("GitHub:")}   ${c.fg(profile.github)}`, theme));
  if (profile.linkedinUrl) lines.push(drawContentLine(`${c.accent("LinkedIn:")} ${c.fg(profile.linkedinUrl)}`, theme));
  if (profile.portfolioUrl) lines.push(drawContentLine(`${c.accent("Website:")}  ${c.fg(profile.portfolioUrl)}`, theme));
  if (profile.timezone) lines.push(drawContentLine(`${c.accent("Timezone:")} ${c.fg(profile.timezone)}`, theme));

  if (lines.length > 0 && (profile.availableForHire !== undefined || profile.responseTime)) {
    lines.push(drawSeparator(theme));
  }

  if (profile.availableForHire) {
    lines.push(drawContentLine(`${c.success(symbols.check)} ${c.success("Available for hire")}`, theme));
    if (profile.responseTime) {
      lines.push(drawContentLine(`  ${c.dim("Response: " + profile.responseTime)}`, theme));
    }
  } else if (profile.availableForHire === false) {
    lines.push(drawContentLine(`${c.muted("Not available for hire at this time")}`, theme));
  }

  if (lines.length === 0) {
    lines.push(drawContentLine(c.muted("No contact info to display"), theme));
  }

  console.log();
  console.log(drawSectionHeader("Contact", theme));
  for (const line of lines) {
    console.log(line);
  }
  console.log(drawSectionFooter(theme));
}
