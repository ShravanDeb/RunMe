import { describe, it, expect } from "vitest";
import { getTheme, getThemeNames } from "../src/ui/themes.js";
import { loadConfig, saveConfig, clearConfig } from "../src/services/config.service.js";

describe("Themes", () => {
  it("should return all theme names", () => {
    const themes = getThemeNames();
    expect(themes).toContain("cyberpunk");
    expect(themes).toContain("dracula");
    expect(themes).toContain("gruvbox");
    expect(themes).toContain("nord");
    expect(themes).toContain("monokai");
    expect(themes).toContain("tokyonight");
  });

  it("should return a valid theme", () => {
    const theme = getTheme("cyberpunk");
    expect(theme.name).toBe("Cyberpunk");
    expect(theme.background).toBeDefined();
    expect(theme.foreground).toBeDefined();
    expect(theme.accent).toBeDefined();
  });
});

describe("Config", () => {
  it("should load empty config", () => {
    clearConfig();
    const config = loadConfig();
    expect(config).toEqual({});
  });

  it("should save and load config", () => {
    saveConfig({ username: "testuser", theme: "dracula" });
    const config = loadConfig();
    expect(config.username).toBe("testuser");
    expect(config.theme).toBe("dracula");
    clearConfig();
  });
});
