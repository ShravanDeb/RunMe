export interface PortfolioData {
  profile: {
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
  };
  projects: {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    tags: string[];
    liveDemoUrl?: string;
    githubRepoUrl?: string;
    projectColor?: string;
  }[];
  experience: {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description: string;
    location?: string;
    isEducation?: boolean;
  }[];
  skills: {
    id: string;
    categoryName: string;
    description?: string;
    skills: string[];
    skillLevel: string;
  }[];
  theme: {
    lockedTheme: string;
    customHexColor?: string;
    gradientColor?: string;
    asciiBanner?: string;
    bootAnimation?: string;
    greeting?: string;
  };
  github?: {
    username: string;
    publicRepos: number;
    followers: number;
    following: number;
    contributions: number;
    topLanguages: { name: string; percentage: number }[];
    recentActivity: { type: string; repo: string; date: string }[];
  };
}
