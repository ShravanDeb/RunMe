import fs from "fs";
import path from "path";
import os from "os";
import { PortfolioData } from "../types/index.js";

const CACHE_DIR = path.join(os.homedir(), ".runme", "cache");
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  data: PortfolioData;
  timestamp: number;
}

export function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCachePath(username: string): string {
  return path.join(CACHE_DIR, `${username}.json`);
}

export function getCachedData(username: string): PortfolioData | null {
  ensureCacheDir();
  const cachePath = getCachePath(username);

  if (!fs.existsSync(cachePath)) {
    return null;
  }

  try {
    const data = fs.readFileSync(cachePath, "utf-8");
    const entry: CacheEntry = JSON.parse(data);

    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      fs.unlinkSync(cachePath);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedData(username: string, data: PortfolioData): void {
  ensureCacheDir();
  const cachePath = getCachePath(username);

  const entry: CacheEntry = {
    data,
    timestamp: Date.now(),
  };

  fs.writeFileSync(cachePath, JSON.stringify(entry, null, 2));
}

export function clearCache(username?: string): void {
  if (username) {
    const cachePath = getCachePath(username);
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
    }
  } else if (fs.existsSync(CACHE_DIR)) {
    fs.readdirSync(CACHE_DIR).forEach((file) => {
      fs.unlinkSync(path.join(CACHE_DIR, file));
    });
  }
}
