import { PortfolioData, ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { drawContentLine, drawEmptyLine, drawSectionHeader, drawSectionFooter, drawSeparator } from "../ui/box.js";

export function showAbout(data: PortfolioData, theme: ThemeColors): void {
  const c = createThemeColors(theme);
  const { profile } = data;

  const lines: string[] = [];

  lines.push(drawContentLine(`${c.bold(profile.name)}`, theme));

  if (profile.title) {
    lines.push(drawContentLine(`${c.muted(profile.title)}`, theme));
  }

  if (profile.bio) {
    lines.push(drawEmptyLine(theme));
    const words = profile.bio.split(" ");
    let line = "";
    for (const word of words) {
      if ((line + " " + word).trim().length > 38) {
        lines.push(drawContentLine(c.fg(line.trim()), theme));
        line = word;
      } else {
        line += (line ? " " : "") + word;
      }
    }
    if (line.trim()) {
      lines.push(drawContentLine(c.fg(line.trim()), theme));
    }
  }

  if (profile.location || profile.timezone || profile.availableForHire !== undefined) {
    lines.push(drawSeparator(theme));
  }

  if (profile.location) {
    lines.push(drawContentLine(`${c.muted(symbols.pin)} ${c.fg(profile.location)}`, theme));
  }
  if (profile.timezone) {
    lines.push(drawContentLine(`${c.muted(symbols.clock)} ${c.fg(profile.timezone)}`, theme));
  }
  if (profile.availableForHire !== undefined) {
    const hireStatus = profile.availableForHire
      ? `${c.success(symbols.check)} ${c.success("Available for hire")}`
      : `${c.error(symbols.cross)} ${c.error("Not available")}`;
    lines.push(drawContentLine(hireStatus, theme));
  }
  if (profile.responseTime) {
    lines.push(drawContentLine(`${c.dim("Response: " + profile.responseTime)}`, theme));
  }

  console.log();
  console.log(drawSectionHeader("About Me", theme));
  for (const line of lines) {
    console.log(line);
  }
  console.log(drawSectionFooter(theme));
}
