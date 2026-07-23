import ora, { Ora } from "ora";
import chalk from "chalk";
import { ThemeColors } from "../types/index.js";

export function createSpinner(theme: ThemeColors) {
  return {
    start(text: string): Ora {
      return ora({
        text: chalk.hex(theme.accent)(text),
        spinner: {
          frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
          interval: 80,
        },
      }).start();
    },
  };
}
