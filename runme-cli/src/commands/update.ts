import chalk from "chalk";
import { ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import axios from "axios";

const NPM_REGISTRY = "https://registry.npmjs.org/@runme/cli";

export async function checkForUpdates(currentVersion: string, theme: ThemeColors): Promise<void> {
  const colors = createThemeColors(theme);

  console.log();
  console.log(colors.bold("  Check for Updates"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  try {
    const response = await axios.get(NPM_REGISTRY);
    const latestVersion = response.data["dist-tags"]?.latest;

    if (!latestVersion) {
      console.log(colors.warning("  Could not determine latest version"));
      console.log();
      return;
    }

    if (currentVersion === latestVersion) {
      console.log(`  ${colors.success(symbols.check)} You are using the latest version (${colors.fg(currentVersion)})`);
    } else {
      console.log(`  ${colors.warning("Update available!")}`);
      console.log(`  ${colors.dim("Current:")}  ${colors.fg(currentVersion)}`);
      console.log(`  ${colors.dim("Latest:")}   ${colors.fg(latestVersion)}`);
      console.log();
      console.log(`  ${colors.accent("Update with:")} npm update -g @runme/cli`);
    }
  } catch {
    console.log(colors.warning("  Could not check for updates"));
  }

  console.log();
}
