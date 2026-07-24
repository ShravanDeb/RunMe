import chalk from "chalk";
import { ThemeColors } from "../types/index.js";
import { createThemeColors } from "./colors.js";

export interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const NUMBERS = ["\u2460", "\u2461", "\u2462", "\u2463", "\u2464", "\u2465", "\u2466", "\u2467", "\u2468"];

export const defaultMenuItems: MenuItem[] = [
  { id: "about", label: "About Me", description: "Who I am", icon: "\u263A" },
  { id: "projects", label: "Projects", description: "My creations", icon: "\u2328" },
  { id: "experience", label: "Experience", description: "My journey", icon: "\u2615" },
  { id: "skills", label: "Skills", description: "Technologies", icon: "\u26A1" },
  { id: "github", label: "GitHub", description: "Open source", icon: "\u2605" },
  { id: "contact", label: "Contact", description: "Reach me", icon: "\u2709" },
  { id: "hire", label: "Hire Me", description: "Availability", icon: "\u2604" },
  { id: "timeline", label: "Timeline", description: "Milestones", icon: "\u2691" },
  { id: "settings", label: "Settings", description: "Preferences", icon: "\u2699" },
];

const W = 46;
const INNER = W - 2;

const ch = {
  tl: "\u256D",
  tr: "\u256E",
  bl: "\u2570",
  br: "\u256F",
  h: "\u2500",
  v: "\u2502",
  tlI: "\u256D",
  trI: "\u250E",
  blI: "\u2570",
  brI: "\u2518",
};

export function renderMenu(items: MenuItem[], theme: ThemeColors): void {
  const c = createThemeColors(theme);

  console.log();
  const label = " Commands ";
  const remaining = INNER - label.length;
  const left = Math.floor(remaining / 2);
  const right = remaining - left;
  console.log(
    `  ${c.accent(ch.tlI)}` +
    c.accent(ch.h.repeat(left)) +
    c.bold(label) +
    c.accent(ch.h.repeat(right)) +
    c.accent(ch.trI)
  );
  console.log(`  ${c.accent(ch.v)}${" ".repeat(INNER)}${c.accent(ch.v)}`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const num = c.accent(NUMBERS[i] || `[${i + 1}]`);
    const label = c.fg(item.label.padEnd(13));
    const desc = c.dim(item.description);
    const row = `${num} ${label} ${desc}`;
    const stripped = stripAnsi(row);
    const pad = Math.max(0, INNER - 2 - stripped.length);
    console.log(`  ${c.accent(ch.v)} ${row}${" ".repeat(pad)} ${c.accent(ch.v)}`);
  }

  console.log(`  ${c.accent(ch.v)}${" ".repeat(INNER)}${c.accent(ch.v)}`);
  console.log(`  ${c.accent(ch.blI)}${c.accent(ch.h.repeat(INNER))}${c.accent(ch.brI)}`);
  console.log();
}

export function renderStatusBar(theme: ThemeColors): void {
  const c = createThemeColors(theme);
  const parts = [
    `${c.dim("[1-9]")} ${c.fg("Select")}`,
    `${c.dim("\u00B7")}`,
    `${c.dim("[q]")} ${c.fg("Quit")}`,
    `${c.dim("\u00B7")}`,
    `${c.dim("[Enter]")} ${c.fg("Back")}`,
  ];
  const text = parts.join("  ");
  const stripped = stripAnsi(text);
  const pad = Math.max(0, W - stripped.length);
  const leftPad = Math.floor(pad / 2);
  const rightPad = pad - leftPad;
  console.log(
    `  ${c.dim("\u2500".repeat(leftPad))} ${text} ${c.dim("\u2500".repeat(rightPad))}`
  );
}

export function renderPrompt(theme: ThemeColors): void {
  const c = createThemeColors(theme);
  process.stdout.write(`  ${c.accent("\u25B8")} ${c.fg("Select: ")}`);
}

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[\u001B\u009B][[\]()#;?]*(?:(?:;(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy>~]))/g, "");
}
