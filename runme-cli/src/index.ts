import { Command } from "commander";
import chalk from "chalk";
import { renderBanner, renderSmallBanner } from "./ui/banner.js";
import { renderMenu, renderPrompt, defaultMenuItems } from "./ui/menu.js";
import { animateText } from "./ui/animations.js";
import { getTheme, getThemeNames } from "./ui/themes.js";
import { loadConfig, saveConfig } from "./services/config.service.js";
import { fetchPortfolio } from "./services/portfolio.service.js";
import { showAbout } from "./commands/about.js";
import { showProjects } from "./commands/projects.js";
import { showExperience } from "./commands/experience.js";
import { showSkills } from "./commands/skills.js";
import { showGitHub } from "./commands/github.js";
import { showContact } from "./commands/contact.js";
import { showHire } from "./commands/hire.js";
import { showTimeline } from "./commands/timeline.js";
import { showSettings, setTheme, setAnimation } from "./commands/settings.js";
import { runDoctor } from "./commands/doctor.js";
import { checkForUpdates } from "./commands/update.js";
import { ThemeName, AnimationType } from "./types/index.js";
import readline from "readline";

const VERSION = "1.0.0";

const program = new Command();

program
  .name("runme")
  .description("Display your portfolio in the terminal")
  .version(VERSION);

program
  .argument("[username]", "Portfolio username to display")
  .option("--theme <theme>", "Override theme")
  .option("--no-animation", "Disable boot animation")
  .action(async (username, options) => {
    const config = loadConfig();
    const themeName = (options.theme || config.theme || "cyberpunk") as ThemeName;
    const theme = getTheme(themeName);

    if (!username) {
      username = config.username;
    }

    if (!username) {
      console.log();
      console.log(chalk.hex(theme.accent)("  Usage: npx @runme/cli <username>"));
      console.log(chalk.dim("  Example: npx @runme/cli johndoe"));
      console.log();
      return;
    }

    if (options.animation !== false && config.animation) {
      const greeting = `Welcome to ${username}'s portfolio`;
      await animateText(greeting, config.animation as AnimationType, theme);
    }

    console.log(renderBanner(undefined, theme));
    console.log();

    try {
      const data = await fetchPortfolio(username);

      if (options.animation !== false) {
        await animateText(`Welcome to ${data.profile.name}'s portfolio`, "typewriter", theme);
      }

      console.log(renderSmallBanner(theme));
      console.log(chalk.dim(`  ${data.profile.title}`));
      console.log();

      startInteractiveMode(data, theme);
    } catch (error) {
      if (error instanceof Error) {
        console.log(chalk.hex(theme.error)(`  Error: ${error.message}`));
      } else {
        console.log(chalk.hex(theme.error)("  An unexpected error occurred"));
      }
      console.log();
    }
  });

program
  .command("theme <name>")
  .description("Set the color theme")
  .action((name) => {
    const config = loadConfig();
    const currentTheme = getTheme((config.theme || "cyberpunk") as ThemeName);

    const validThemes = getThemeNames();
    if (!validThemes.includes(name as ThemeName)) {
      console.log(`\n  Available themes: ${validThemes.join(", ")}\n`);
      return;
    }

    setTheme(name as ThemeName, currentTheme);
  });

program
  .command("animation <name>")
  .description("Set the boot animation")
  .action((name) => {
    const config = loadConfig();
    const currentTheme = getTheme((config.theme || "cyberpunk") as ThemeName);

    const validAnimations: AnimationType[] = [
      "typewriter", "matrix", "glitch", "wave", "fadeIn",
      "scanLine", "decrypt", "neonGlow", "bounceIn", "slideIn",
      "colorCycle", "pixelate", "typewriterDelete", "fire", "rainbowWave",
    ];

    if (!validAnimations.includes(name as AnimationType)) {
      console.log(`\n  Available animations: ${validAnimations.join(", ")}\n`);
      return;
    }

    setAnimation(name, currentTheme);
  });

program
  .command("doctor")
  .description("Run diagnostics")
  .action(async () => {
    const config = loadConfig();
    const theme = getTheme((config.theme || "cyberpunk") as ThemeName);
    await runDoctor(theme);
  });

program
  .command("update")
  .description("Check for updates")
  .action(async () => {
    const config = loadConfig();
    const theme = getTheme((config.theme || "cyberpunk") as ThemeName);
    await checkForUpdates(VERSION, theme);
  });

program.parse();

function clearScreen() {
  process.stdout.write("\x1B[2J\x1B[0f");
}

function drawHeader(data: any, theme: any) {
  console.log(renderBanner(undefined, theme));
  console.log();
  console.log(renderSmallBanner(theme));
  console.log(chalk.dim(`  ${data.profile.title}`));
  console.log();
}

function startInteractiveMode(data: any, theme: any) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const showMenu = () => {
    renderMenu(defaultMenuItems, theme);
    renderPrompt(theme);

    rl.question("", async (answer) => {
      const trimmed = answer.trim().toLowerCase();

      if (trimmed === "quit" || trimmed === "exit" || trimmed === "q") {
        console.log();
        console.log(chalk.dim("  Thanks for visiting!"));
        console.log();
        rl.close();
        return;
      }

      if (trimmed === "clear") {
        clearScreen();
        drawHeader(data, theme);
        showMenu();
        return;
      }

      const num = parseInt(trimmed);
      if (!isNaN(num) && num >= 1 && num <= defaultMenuItems.length) {
        const item = defaultMenuItems[num - 1];
        handleCommand(item.id, data, theme);
      } else {
        handleCommand(trimmed, data, theme);
      }

      // Clear screen, redraw header, then show menu
      clearScreen();
      drawHeader(data, theme);
      showMenu();
    });
  };

  showMenu();
}

function handleCommand(command: string, data: any, theme: any) {
  switch (command) {
    case "about":
      showAbout(data, theme);
      break;
    case "projects":
      showProjects(data, theme);
      break;
    case "experience":
      showExperience(data, theme);
      break;
    case "skills":
      showSkills(data, theme);
      break;
    case "github":
      showGitHub(data, theme);
      break;
    case "contact":
      showContact(data, theme);
      break;
    case "hire":
      showHire(data, theme);
      break;
    case "timeline":
      showTimeline(data, theme);
      break;
    case "settings":
      showSettings(theme);
      break;
    default:
      console.log(chalk.dim(`  Unknown command: ${command}`));
  }
}
