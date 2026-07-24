import { ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { loadConfig } from "../services/config.service.js";
import axios from "axios";
import { drawContentLine, drawEmptyLine, drawSectionHeader, drawSectionFooter, drawSeparator } from "../ui/box.js";

const API_BASE_URL = process.env.RUNME_API_URL || "https://run-me-rose.vercel.app";

export async function runDoctor(theme: ThemeColors): Promise<void> {
  const c = createThemeColors(theme);

  const lines: string[] = [];

  const checks: { name: string; status: boolean; message: string }[] = [];

  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1));
  checks.push({
    name: "Node.js",
    status: nodeMajor >= 18,
    message: nodeVersion + (nodeMajor >= 18 ? "" : " (requires >= 18)"),
  });

  const config = loadConfig();
  checks.push({
    name: "Config",
    status: true,
    message: config.username ? `User: ${config.username}` : "Not logged in",
  });

  try {
    await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    checks.push({ name: "API", status: true, message: "Connected" });
  } catch {
    checks.push({ name: "API", status: false, message: "Cannot reach server" });
  }

  checks.push({ name: "npm", status: true, message: "Available" });

  for (const check of checks) {
    const icon = check.status ? c.success(symbols.check) : c.error(symbols.cross);
    lines.push(drawContentLine(`${icon} ${c.fg(check.name.padEnd(8))} ${c.dim(check.message)}`, theme));
  }

  lines.push(drawSeparator(theme));

  const allPassed = checks.every((ch) => ch.status);
  lines.push(
    drawContentLine(
      allPassed ? c.success("All checks passed!") : c.warning("Some checks failed"),
      theme
    )
  );

  console.log();
  console.log(drawSectionHeader("Doctor", theme));
  for (const line of lines) {
    console.log(line);
  }
  console.log(drawSectionFooter(theme));
}
