import chalk from "chalk";
import { AnimationType, ThemeColors } from "../types/index.js";

export async function animateText(
  text: string,
  animation: AnimationType,
  theme: ThemeColors
): Promise<void> {
  const color = chalk.hex(theme.accent);

  switch (animation) {
    case "typewriter":
      await typewriter(text, color);
      break;
    case "matrix":
      await matrix(text, theme);
      break;
    case "glitch":
      await glitch(text, theme);
      break;
    case "wave":
      await wave(text, theme);
      break;
    case "fadeIn":
      await fadeIn(text, color);
      break;
    case "scanLine":
      await scanLine(text, theme);
      break;
    case "decrypt":
      await decrypt(text, theme);
      break;
    case "neonGlow":
      await neonGlow(text, theme);
      break;
    case "bounceIn":
      await bounceIn(text, color);
      break;
    case "slideIn":
      await slideIn(text, color);
      break;
    case "colorCycle":
      await colorCycle(text, theme);
      break;
    case "pixelate":
      await pixelate(text, theme);
      break;
    case "typewriterDelete":
      await typewriterDelete(text, color);
      break;
    case "fire":
      await fire(text);
      break;
    case "rainbowWave":
      await rainbowWave(text);
      break;
    default:
      console.log(color(text));
  }
}

async function typewriter(text: string, color: chalk.Chalk): Promise<void> {
  for (const char of text) {
    process.stdout.write(color(char));
    await sleep(50);
  }
  console.log();
}

async function matrix(text: string, theme: ThemeColors): Promise<void> {
  const chars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789";
  const iterations = 10;

  for (let i = 0; i < iterations; i++) {
    let result = "";
    for (const char of text) {
      if (Math.random() > i / iterations) {
        result += chars[Math.floor(Math.random() * chars.length)];
      } else {
        result += char;
      }
    }
    process.stdout.write("\r" + chalk.hex(theme.success)(result));
    await sleep(50);
  }
  console.log();
}

async function glitch(text: string, theme: ThemeColors): Promise<void> {
  const glitchChars = "░▒▓█▄▀■□◊";
  const iterations = 8;

  for (let i = 0; i < iterations; i++) {
    let result = "";
    for (const char of text) {
      if (Math.random() > 0.7) {
        result += glitchChars[Math.floor(Math.random() * glitchChars.length)];
      } else {
        result += char;
      }
    }
    process.stdout.write("\r" + chalk.hex(theme.error)(result));
    await sleep(80);
  }
  console.log("\r" + chalk.hex(theme.accent)(text));
}

async function wave(text: string, theme: ThemeColors): Promise<void> {
  const frames = 20;
  for (let i = 0; i < frames; i++) {
    let result = "";
    for (let j = 0; j < text.length; j++) {
      const offset = Math.sin((j + i) * 0.3) * 2;
      result += " ".repeat(Math.max(0, Math.round(offset)));
      result += text[j];
    }
    process.stdout.write("\r" + result);
    await sleep(60);
  }
  console.log();
}

async function fadeIn(text: string, color: chalk.Chalk): Promise<void> {
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const opacity = i / steps;
    const rendered = color(`rgba(${Math.round(opacity * 255)})`) + text;
    process.stdout.write("\r" + rendered);
    await sleep(50);
  }
  console.log("\r" + color(text));
}

async function scanLine(text: string, theme: ThemeColors): Promise<void> {
  const width = text.length;
  for (let i = 0; i < width; i++) {
    let result = "";
    for (let j = 0; j < width; j++) {
      if (j === i) {
        result += chalk.bgHex(theme.accent).hex(theme.background)(text[j]);
      } else if (j < i) {
        result += chalk.hex(theme.foreground)(text[j]);
      } else {
        result += chalk.hex(theme.muted)(text[j]);
      }
    }
    process.stdout.write("\r" + result);
    await sleep(30);
  }
  console.log();
}

async function decrypt(text: string, theme: ThemeColors): Promise<void> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const iterations = text.length;

  for (let i = 0; i < iterations; i++) {
    let result = "";
    for (let j = 0; j < text.length; j++) {
      if (j <= i) {
        result += text[j];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    process.stdout.write("\r" + chalk.hex(theme.muted)(result));
    await sleep(40);
  }
  console.log("\r" + chalk.hex(theme.accent)(text));
}

async function neonGlow(text: string, theme: ThemeColors): Promise<void> {
  const pulses = 6;
  for (let i = 0; i < pulses; i++) {
    const intensity = Math.sin((i / pulses) * Math.PI);
    const color = chalk.hex(theme.accent);
    process.stdout.write("\r" + color(text));
    await sleep(150);
    process.stdout.write("\r" + chalk.dim(text));
    await sleep(150);
  }
  console.log("\r" + chalk.hex(theme.accent)(text));
}

async function bounceIn(text: string, color: chalk.Chalk): Promise<void> {
  const steps = 15;
  for (let i = 0; i < steps; i++) {
    const progress = i / steps;
    const bounce = Math.sin(progress * Math.PI * 3) * (1 - progress);
    const y = Math.round(bounce * 5);
    const spaces = " ".repeat(y);
    process.stdout.write("\r" + spaces + color(text));
    await sleep(50);
  }
  console.log("\r" + color(text));
}

async function slideIn(text: string, color: chalk.Chalk): Promise<void> {
  const width = 40;
  for (let i = 0; i < width; i++) {
    const spaces = " ".repeat(width - i);
    process.stdout.write("\r" + spaces + color(text));
    await sleep(20);
  }
  console.log();
}

async function colorCycle(text: string, theme: ThemeColors): Promise<void> {
  const colors = [theme.accent, theme.secondary, theme.success, theme.warning, theme.error];
  const cycles = 3;

  for (let i = 0; i < cycles * text.length; i++) {
    let result = "";
    for (let j = 0; j < text.length; j++) {
      const colorIndex = (j + i) % colors.length;
      result += chalk.hex(colors[colorIndex])(text[j]);
    }
    process.stdout.write("\r" + result);
    await sleep(30);
  }
  console.log();
}

async function pixelate(text: string, theme: ThemeColors): Promise<void> {
  const blocks = " ░▒▓█";
  const iterations = 8;

  for (let i = 0; i < iterations; i++) {
    let result = "";
    for (const char of text) {
      if (Math.random() > i / iterations) {
        result += chalk.hex(theme.muted)(blocks[Math.floor(Math.random() * blocks.length)]);
      } else {
        result += chalk.hex(theme.accent)(char);
      }
    }
    process.stdout.write("\r" + result);
    await sleep(100);
  }
  console.log("\r" + chalk.hex(theme.accent)(text));
}

async function typewriterDelete(text: string, color: chalk.Chalk): Promise<void> {
  for (const char of text) {
    process.stdout.write(color(char));
    await sleep(50);
  }
  await sleep(500);
  for (let i = text.length; i >= 0; i--) {
    process.stdout.write("\r" + color(text.substring(0, i)));
    await sleep(30);
  }
  await sleep(200);
  for (const char of text) {
    process.stdout.write(color(char));
    await sleep(50);
  }
  console.log();
}

async function fire(text: string): Promise<void> {
  const fireColors = ["#ff0000", "#ff4400", "#ff8800", "#ffcc00", "#ffff00"];
  const iterations = 10;

  for (let i = 0; i < iterations; i++) {
    let result = "";
    for (const char of text) {
      const colorIndex = Math.floor(Math.random() * fireColors.length);
      result += chalk.hex(fireColors[colorIndex])(char);
    }
    process.stdout.write("\r" + result);
    await sleep(80);
  }
  console.log();
}

async function rainbowWave(text: string): Promise<void> {
  const rainbow = ["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0088ff", "#8800ff"];
  const frames = 15;

  for (let i = 0; i < frames; i++) {
    let result = "";
    for (let j = 0; j < text.length; j++) {
      const colorIndex = (j + i) % rainbow.length;
      result += chalk.hex(rainbow[colorIndex])(text[j]);
    }
    process.stdout.write("\r" + result);
    await sleep(60);
  }
  console.log();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
