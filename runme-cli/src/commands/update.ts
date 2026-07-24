import { ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import axios from "axios";
import { drawContentLine, drawEmptyLine, drawSectionHeader, drawSectionFooter, drawSeparator } from "../ui/box.js";

const NPM_REGISTRY = "https://registry.npmjs.org/runme-cli";

export async function checkForUpdates(currentVersion: string, theme: ThemeColors): Promise<void> {
  const c = createThemeColors(theme);

  const lines: string[] = [];

  try {
    const response = await axios.get(NPM_REGISTRY);
    const latestVersion = response.data["dist-tags"]?.latest;

    if (!latestVersion) {
      lines.push(drawContentLine(c.warning("Could not determine latest version"), theme));
    } else if (currentVersion === latestVersion) {
      lines.push(drawContentLine(`${c.success(symbols.check)} Latest version (${c.fg(currentVersion)})`, theme));
    } else {
      lines.push(drawContentLine(`${c.warning("Update available!")}`, theme));
      lines.push(drawContentLine(`${c.dim("Current:")} ${c.fg(currentVersion)}`, theme));
      lines.push(drawContentLine(`${c.dim("Latest:")}  ${c.fg(latestVersion)}`, theme));
      lines.push(drawEmptyLine(theme));
      lines.push(drawContentLine(`${c.accent("Update:")} npm update -g runme-cli`, theme));
    }
  } catch {
    lines.push(drawContentLine(c.warning("Could not check for updates"), theme));
  }

  console.log();
  console.log(drawSectionHeader("Updates", theme));
  for (const line of lines) {
    console.log(line);
  }
  console.log(drawSectionFooter(theme));
}
