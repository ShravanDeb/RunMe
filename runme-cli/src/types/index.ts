export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  location?: string;
  availableForHire?: boolean;
  responseTime?: string;
  timezone?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  liveDemoUrl?: string;
  githubRepoUrl?: string;
  projectColor?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  location?: string;
  isEducation?: boolean;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  description?: string;
  skills: string[];
  skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Theme {
  lockedTheme: "cyberpunk" | "dracula" | "gruvbox" | "nord" | "monokai" | "tokyonight";
  customHexColor?: string;
  asciiBanner?: string;
  bootAnimation?: string;
  greeting?: string;
}

export interface GitHubStats {
  username: string;
  publicRepos: number;
  followers: number;
  following: number;
  contributions: number;
  topLanguages: { name: string; percentage: number }[];
  recentActivity: { type: string; repo: string; date: string }[];
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  skills: SkillCategory[];
  theme: Theme;
  github?: GitHubStats;
}

export type AnimationType =
  | "typewriter"
  | "matrix"
  | "glitch"
  | "wave"
  | "fadeIn"
  | "scanLine"
  | "decrypt"
  | "neonGlow"
  | "bounceIn"
  | "slideIn"
  | "colorCycle"
  | "pixelate"
  | "typewriterDelete"
  | "fire"
  | "rainbowWave";

export type ThemeName =
  | "cyberpunk"
  | "dracula"
  | "gruvbox"
  | "nord"
  | "monokai"
  | "tokyonight";

export interface ThemeColors {
  name: string;
  background: string;
  foreground: string;
  accent: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  muted: string;
}
