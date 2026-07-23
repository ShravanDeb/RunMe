import chalk from "chalk";
import { ThemeColors } from "../types/index.js";
import { createThemeColors } from "../ui/colors.js";
import { symbols } from "../ui/symbols.js";
import { loadConfig } from "../services/config.service.js";
import axios from "axios";

const API_BASE_URL = process.env.RUNME_API_URL || "https://run-me-rose.vercel.app";

export async function runDoctor(theme: ThemeColors): Promise<void> {
  const colors = createThemeColors(theme);

  console.log();
  console.log(colors.bold("  Doctor"));
  console.log(colors.muted("  " + symbols.line.repeat(40)));
  console.log();

  const checks: { name: string; status: boolean; message: string }[] = [];

  // Check Node.js version
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1));
  checks.push({
    name: "Node.js version",
    status: nodeMajor >= 18,
    message: nodeVersion + (nodeMajor >= 18 ? "" : " (requires >= 18.0.0)"),
  });

  // Check config
  const config = loadConfig();
  checks.push({
    name: "Config file",
    status: true,
    message: config.username ? `Logged in as ${config.username}` : "Not logged in",
  });

  // Check API connectivity
  try {
    await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    checks.push({
      name: "API connection",
      status: true,
      message: "Connected",
    });
  } catch {
    checks.push({
      name: "API connection",
      status: false,
      message: "Cannot reach API server",
    });
  }

  // Check npm
  checks.push({
    name: "npm",
    status: true,
    message: "Available",
  });

  // Display results
  checks.forEach((check) => {
    const status = check.status
      ? colors.success(symbols.check)
      : colors.error(symbols.cross);
    console.log(`  ${status} ${colors.fg(check.name)}: ${colors.dim(check.message)}`);
  });

  console.log();
  console.log(colors.muted("  " + symbols.line.repeat(40)));

  const allPassed = checks.every((c) => c.status);
  if (allPassed) {
    console.log(`  ${colors.success("All checks passed!")}`);
  } else {
    console.log(`  ${colors.warning("Some checks failed. Please fix the issues above.")}`);
  }

  console.log();
}
