import axios from "axios";
import { PortfolioData, ThemeName } from "../types/index.js";
import { getCachedData, setCachedData } from "./cache.service.js";

const API_BASE_URL = process.env.RUNME_API_URL || "https://run-me-rose.vercel.app";

export async function fetchPortfolio(username: string): Promise<PortfolioData> {
  const cached = getCachedData(username);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/portfolio/${username}`);
    const data: PortfolioData = response.data;
    setCachedData(username, data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Portfolio not found for user: ${username}`);
      }
      if (error.response?.status === 503) {
        const cached = getCachedData(username);
        if (cached) {
          return cached;
        }
        throw new Error("Service unavailable. Please try again later.");
      }
    }
    throw error;
  }
}

export async function fetchGitHubStats(username: string): Promise<PortfolioData["github"]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/github/${username}`);
    return response.data;
  } catch {
    return undefined;
  }
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/check/${username}`);
    return response.data.available;
  } catch {
    return false;
  }
}
