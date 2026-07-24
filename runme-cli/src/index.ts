import { Command } from "commander";
import chalk from "chalk";
import { renderBanner, renderSmallBanner } from "./ui/banner.js";
import { renderMenu, renderPrompt, renderStatusBar, defaultMenuItems } from "./ui/menu.js";
import { animateText } from "./ui/animations.js";
import { getTheme, getThemeNames } from "./ui/themes.js";
import { createThemeColors } from "./ui/colors.js";
import { loadConfig, saveConfig } from "./services/config.service.js";
import { fetchPortfolio } from "./services/portfolio.service.js";
import { clearCache } from "./services/cache.service.js";
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
import { ThemeName, AnimationType, ThemeColors, PortfolioData } from "./types/index.js";
import readline from "readline";

const VERSION = "1.0.12";

function resolveTheme(data: PortfolioData, localConfig: { theme?: string }): ThemeColors {
  const themeName = (localConfig.theme || data.theme?.lockedTheme || "cyberpunk") as ThemeName;
  const base = getTheme(themeName);
  if (data.theme?.customHexColor) {
    return { ...base, accent: data.theme.customHexColor };
  }
  return base;
}

const program = new Command();

program
  .name("runme")
  .description("Display your portfolio in the terminal")
  .version(VERSION);

program
  .argument("[username]", "Portfolio username to display")
  .option("--theme <theme>", "Override theme")
  .option("--no-animation", "Disable boot animation")
  .option("--refresh", "Clear cache and fetch fresh data")
  .action(async (username, options) => {
    const config = loadConfig();

    if (!username) {
      username = config.username;
    }

    if (!username) {
      const defaultTheme = getTheme("cyberpunk");
      console.log();
      console.log(chalk.hex(defaultTheme.accent)("  Usage: npx runme-cli <username>"));
      console.log(chalk.dim("  Example: npx runme-cli johndoe"));
      console.log();
      return;
    }

    try {
      if (options.refresh && username) {
        clearCache(username);
      }
      const data = await fetchPortfolio(username);

      const theme = options.theme
        ? getTheme(options.theme as ThemeName)
        : resolveTheme(data, config);

      const greeting = data.theme?.greeting || `Welcome to ${data.profile.name}'s portfolio`;
      const bootAnim = (config.animation || data.theme?.bootAnimation || "typewriter") as AnimationType;

      if (options.animation !== false && bootAnim) {
        await animateText(greeting, bootAnim, theme);
      }

      startInteractiveMode(data, theme);
    } catch (error) {
      if (error instanceof Error) {
        const errTheme = getTheme("cyberpunk");
        console.log(chalk.hex(errTheme.error)(`  Error: ${error.message}`));
      } else {
        const errTheme = getTheme("cyberpunk");
        console.log(chalk.hex(errTheme.error)("  An unexpected error occurred"));
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
  .command("clear")
  .description("Clear cached portfolio data")
  .argument("[username]", "Username to clear cache for (clears all if omitted)")
  .action((username) => {
    const colors = createThemeColors(getTheme("cyberpunk"));
    try {
      clearCache(username);
      const msg = username
        ? `Cache cleared for ${username}`
        : "All cached data cleared";
      console.log(`\n  ${colors.success("✓")} ${colors.fg(msg)}\n`);
    } catch {
      const errColors = createThemeColors(getTheme("cyberpunk"));
      console.log(`\n  ${errColors.error("✕")} Failed to clear cache\n`);
    }
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
  console.clear();
}

function drawHeader(data: PortfolioData, theme: ThemeColors) {
  const c = createThemeColors(theme);
  const bannerText = data.theme?.asciiBanner || undefined;
  console.log(renderBanner(bannerText, theme, data.theme?.gradientColor));
  console.log();
  const smallBanner = renderSmallBanner(theme);
  const title = data.profile.title;
  console.log(`  ${smallBanner}${title ? c.dim(` \u2500\u2500 ${title}`) : ""}`);
  console.log();
  const greeting = data.theme?.greeting || `Welcome to ${data.profile.name}'s portfolio`;
  console.log(`  ${c.accent(greeting)}`);
}

function startInteractiveMode(data: PortfolioData, theme: ThemeColors) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.on("SIGINT", () => {
    console.log();
    console.log(chalk.dim("  Thanks for visiting!"));
    console.log();
    rl.close();
    process.exit(0);
  });

  rl.on("close", () => {
    process.exit(0);
  });

  const renderFullView = () => {
    clearScreen();
    drawHeader(data, theme);
    console.log();
    renderMenu(defaultMenuItems, theme);
    renderStatusBar(theme);
    renderPrompt(theme);
  };

  const renderCommandView = () => {
    clearScreen();
    drawHeader(data, theme);
    console.log();
  };

  const showMenu = () => {
    renderFullView();

    rl.question("", (answer) => {
      const trimmed = answer.trim().toLowerCase();

      if (trimmed === "quit" || trimmed === "exit" || trimmed === "q") {
        console.log();
        console.log(chalk.dim("  Thanks for visiting!"));
        console.log();
        rl.close();
        return;
      }

      if (trimmed === "clear") {
        showMenu();
        return;
      }

      renderCommandView();

      const num = parseInt(trimmed);
      if (!isNaN(num) && num >= 1 && num <= defaultMenuItems.length) {
        const item = defaultMenuItems[num - 1];
        handleCommand(item.id, data, theme);
      } else {
        handleCommand(trimmed, data, theme);
      }

      const colors = createThemeColors(theme);
      console.log();
      renderStatusBar(theme);
      console.log();
      process.stdout.write(`  ${colors.accent("\u25B8")} ${colors.fg("Press Enter to return to menu...")}`);


      rl.question("", () => {
        showMenu();
      });
    });
  };

  showMenu();
}

function handleCommand(command: string, data: PortfolioData, theme: ThemeColors) {
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
