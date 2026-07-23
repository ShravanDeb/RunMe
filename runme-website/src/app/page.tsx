"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const DEMO = {
  profile: {
    name: "RunMe",
    title: "Developer Portfolio, Terminal Edition",
    bio: "A CLI tool and platform that lets developers showcase their portfolio right in the terminal. One command. That's it.",
    location: "Open Source",
    email: "hello@runme.dev",
    phone: "",
    website: "https://runme.dev",
    github: "https://github.com/runme",
    linkedin: "",
    availableForHire: false,
    responseTime: "",
    timezone: "",
  },
  projects: [
    { title: "runme-cli", subtitle: "The CLI tool", description: "Install with npm. Run npx @runme/<username>. See any developer's portfolio in your terminal with themes and animations.", tags: ["typescript", "cli", "node"], liveDemoUrl: "", githubRepoUrl: "https://github.com/runme/cli" },
    { title: "runme-website", subtitle: "The dashboard", description: "Web app to manage your portfolio. Fill in projects, experience, skills, theme. Everything syncs to the CLI.", tags: ["next.js", "react", "tailwind"], githubRepoUrl: "https://github.com/runme/website" },
    { title: "runme-api", subtitle: "The backend", description: "Express + Firebase API. Auth, CRUD, GitHub stats integration. Serves portfolio data to the CLI.", tags: ["express", "firebase", "rest"], githubRepoUrl: "https://github.com/runme/api" },
  ],
  experience: [
    { role: "Created", company: "runme-cli v1.0", startDate: "2026", endDate: "Present", description: "Launched with 15 text animations, 6 color themes, GitHub integration, and interactive menu.", location: "Open Source", isEducation: false },
    { role: "Built", company: "runme-website + API", startDate: "2026", endDate: "Present", description: "Full-stack dashboard with auth, profile management, and real-time GitHub stats.", location: "Open Source", isEducation: false },
  ],
  skills: [
    { categoryName: "CLI", skills: ["Commander.js", "Chalk", "Ink", "Boxen", "Ora"], skillLevel: "expert" },
    { categoryName: "Frontend", skills: ["Next.js", "React", "Tailwind CSS", "Framer Motion"], skillLevel: "expert" },
    { categoryName: "Backend", skills: ["Express", "Firebase Admin", "Firestore", "JWT Auth"], skillLevel: "expert" },
    { categoryName: "Infra", skills: ["npm", "GitHub Actions", "REST API", "TypeScript"], skillLevel: "advanced" },
  ],
  github: {
    username: "runme",
    publicRepos: 3,
    followers: 0,
    following: 0,
    contributions: 0,
    topLanguages: [
      { name: "TypeScript", percentage: 85 },
      { name: "JavaScript", percentage: 10 },
      { name: "Shell", percentage: 5 },
    ],
    recentActivity: [
      { type: "push", repo: "runme/cli", date: "just now" },
      { type: "push", repo: "runme/website", date: "just now" },
      { type: "create", repo: "runme/api", date: "today" },
    ],
  },
};

const BANNER_LINES = [
  "██████╗ ██╗   ██╗███╗   ██╗    ███╗   ███╗███████╗",
  "██╔══██╗██║   ██║████╗  ██║    ████╗ ████║██╔════╝",
  "██████╔╝██║   ██║██╔██╗ ██║    ██╔████╔██║█████╗  ",
  "██╔══██╗██║   ██║██║╚██╗██║    ██║╚██╔╝██║██╔══╝  ",
  "██║  ██║╚██████╔╝██║ ╚████║    ██║ ╚═╝ ██║███████╗",
  "╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝     ╚═╝╚══════╝",
];

const MENU_ITEMS = [
  { id: "1", label: "About Me", desc: "Who I am and what I do" },
  { id: "2", label: "Projects", desc: "My work and creations" },
  { id: "3", label: "Experience", desc: "My professional journey" },
  { id: "4", label: "Skills", desc: "Technologies I work with" },
  { id: "5", label: "GitHub", desc: "My open source contributions" },
  { id: "6", label: "Contact", desc: "How to reach me" },
  { id: "7", label: "Hire Me", desc: "Availability and rates" },
  { id: "8", label: "Timeline", desc: "Career milestones" },
];

const LINE = "\u2500".repeat(40);

type Ln = { text: string; className?: string };

function cmdAbout(): Ln[] {
  const p = DEMO.profile;
  return [
    { text: "" },
    { text: "  About Me", className: "font-bold text-fg" },
    { text: "" },
    { text: `  Name:   ${p.name}`, className: "text-fg" },
    { text: `  Title:  ${p.title}`, className: "text-fg" },
    { text: `  Bio:    ${p.bio}`, className: "text-fg" },
    { text: "" },
    { text: `  ${p.location}  |  ${p.website}  |  ${p.github}`, className: "text-accent" },
    { text: "" },
  ];
}

function cmdProjects(): Ln[] {
  const lines: Ln[] = [
    { text: "" },
    { text: "  Projects", className: "font-bold text-fg" },
    { text: "" },
  ];
  DEMO.projects.forEach((p, i) => {
    lines.push({ text: `  [${i + 1}] ${p.title} — ${p.subtitle}`, className: "text-fg font-bold" });
    lines.push({ text: `      ${p.description}`, className: "text-muted" });
    lines.push({ text: `      ${p.tags.map((t) => `#${t}`).join(" ")}`, className: "text-secondary" });
    lines.push({ text: "" });
  });
  return lines;
}

function cmdExperience(): Ln[] {
  const lines: Ln[] = [
    { text: "" },
    { text: "  Experience", className: "font-bold text-fg" },
    { text: "" },
  ];
  DEMO.experience.filter((e) => !e.isEducation).forEach((e) => {
    lines.push({ text: `  ${e.role} — ${e.company}`, className: "text-fg font-bold" });
    lines.push({ text: `  ${e.startDate}–${e.endDate}  |  ${e.location}`, className: "text-muted" });
    lines.push({ text: `  ${e.description}`, className: "text-fg" });
    lines.push({ text: "" });
  });
  return lines;
}

function cmdSkills(): Ln[] {
  const lines: Ln[] = [
    { text: "" },
    { text: "  Skills", className: "font-bold text-fg" },
    { text: "" },
  ];
  DEMO.skills.forEach((s) => {
    lines.push({ text: `  ${s.categoryName}: ${s.skills.join(", ")}`, className: "text-fg" });
  });
  lines.push({ text: "" });
  return lines;
}

function cmdGithub(): Ln[] {
  const g = DEMO.github;
  const lines: Ln[] = [
    { text: "" },
    { text: "  GitHub", className: "font-bold text-fg" },
    { text: "" },
    { text: `  ${g.username}  |  ${g.publicRepos} repos  |  ${g.followers} followers`, className: "text-fg" },
    { text: "" },
  ];
  g.topLanguages.forEach((l) => {
    const barLen = Math.round(l.percentage / 5);
    const bar = "\u2588".repeat(barLen) + "\u2591".repeat(20 - barLen);
    lines.push({ text: `  ${l.name.padEnd(12)} ${bar} ${l.percentage}%`, className: "text-fg" });
  });
  lines.push({ text: "" });
  return lines;
}

function cmdContact(): Ln[] {
  const p = DEMO.profile;
  return [
    { text: "" },
    { text: "  Contact", className: "font-bold text-fg" },
    { text: "" },
    { text: `  Email:    ${p.email}`, className: "text-fg" },
    { text: `  GitHub:   ${p.github}`, className: "text-accent" },
    { text: `  Website:  ${p.website}`, className: "text-accent" },
    { text: "" },
  ];
}

function cmdHire(): Ln[] {
  const p = DEMO.profile;
  return [
    { text: "" },
    { text: "  Hire Me", className: "font-bold text-fg" },
    { text: "" },
    { text: `  Email:     ${p.email}`, className: "text-fg" },
    { text: `  Website:   ${p.website}`, className: "text-fg" },
    { text: "" },
  ];
}

function cmdTimeline(): Ln[] {
  const lines: Ln[] = [
    { text: "" },
    { text: "  Timeline", className: "font-bold text-fg" },
    { text: "" },
  ];
  const sorted = [...DEMO.experience].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  sorted.forEach((e) => {
    lines.push({ text: `  ${e.startDate}  ${e.role} — ${e.company}`, className: "text-fg" });
  });
  lines.push({ text: "" });
  return lines;
}

function cmdHelp(): Ln[] {
  return [
    { text: "" },
    { text: "  Commands:", className: "font-bold text-fg" },
    { text: "" },
    ...MENU_ITEMS.map((m) => ({
      text: `  [${m.id}] ${m.label.padEnd(14)} ${m.desc}`,
      className: "text-muted",
    })),
    { text: "" },
    { text: "  Type a number or name, or 'quit' to exit", className: "text-muted" },
    { text: "" },
  ];
}

function showMenu(): Ln[] {
  const lines: Ln[] = [
    { text: "" },
    { text: "  Commands:", className: "font-bold text-fg" },
    { text: "" },
  ];
  MENU_ITEMS.forEach((m) => {
    lines.push({ text: `  [${m.id}] ${m.label.padEnd(14)} ${m.desc}`, className: "text-fg" });
  });
  lines.push({ text: "" });
  return lines;
}

function handleCommand(input: string): Ln[] {
  const cmd = input.trim().toLowerCase();
  switch (cmd) {
    case "1":
    case "about":
      return cmdAbout();
    case "2":
    case "projects":
      return cmdProjects();
    case "3":
    case "experience":
      return cmdExperience();
    case "4":
    case "skills":
      return cmdSkills();
    case "5":
    case "github":
      return cmdGithub();
    case "6":
    case "contact":
      return cmdContact();
    case "7":
    case "hire":
      return cmdHire();
    case "8":
    case "timeline":
      return cmdTimeline();
    case "help":
      return cmdHelp();
    case "clear":
      return [];
    default:
      return [
        { text: `  Unknown command: ${cmd}`, className: "text-error" },
        { text: "  Type a number (1-8) or command name", className: "text-muted" },
      ];
  }
}

function LiveTerminal() {
  const [headerLines, setHeaderLines] = useState<Ln[]>([]);
  const [contentLines, setContentLines] = useState<Ln[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [phase, setPhase] = useState<"banner" | "welcome" | "menu" | "input">("banner");
  const [bannerLine, setBannerLine] = useState(0);
  const [welcomeText, setWelcomeText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Boot: banner lines go into HEADER (permanent)
  useEffect(() => {
    if (phase !== "banner") return;
    if (bannerLine < BANNER_LINES.length) {
      const t = setTimeout(() => {
        setHeaderLines((prev) => [...prev, { text: BANNER_LINES[bannerLine], className: "text-accent" }]);
        setBannerLine((b) => b + 1);
      }, bannerLine === 0 ? 400 : 60);
      return () => clearTimeout(t);
    } else {
      setPhase("welcome");
    }
  }, [bannerLine, phase]);

  // Welcome typewriter goes into HEADER (permanent)
  useEffect(() => {
    if (phase !== "welcome") return;
    const fullText = `  Welcome to ${DEMO.profile.name}'s portfolio`;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setWelcomeText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(t);
        setTimeout(() => setPhase("menu"), 300);
      }
    }, 30);
    return () => clearInterval(t);
  }, [phase]);

  // Menu appears in CONTENT (dynamic, clears on each command)
  useEffect(() => {
    if (phase !== "menu") return;
    const menuLines = showMenu();
    let i = 0;
    const t = setInterval(() => {
      if (i < menuLines.length) {
        setContentLines((prev) => [...prev, menuLines[i]]);
        i++;
      } else {
        clearInterval(t);
        setPhase("input");
      }
    }, 15);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    scrollBottom();
  }, [headerLines, contentLines, welcomeText, scrollBottom]);

  useEffect(() => {
    function focus(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(".terminal-container")) {
        inputRef.current?.focus();
      }
    }
    document.addEventListener("click", focus);
    return () => document.removeEventListener("click", focus);
  }, []);

  function processCommand(cmd: string) {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === "quit" || trimmed === "exit" || trimmed === "q") {
      setContentLines([
        { text: "" },
        { text: "  Thanks for visiting!", className: "text-muted" },
        { text: "" },
      ]);
      setInput("");
      return;
    }

    if (trimmed === "clear") {
      setContentLines([]);
      setInput("");
      // Re-show menu
      setTimeout(() => {
        const menuLines = showMenu();
        setContentLines(menuLines);
        setPhase("input");
      }, 100);
      return;
    }

    const result = handleCommand(cmd);
    // Clear content, show command output + menu
    const menuLines = showMenu();
    setContentLines([...result, ...menuLines]);
    setInput("");
    setPhase("input");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      processCommand(input);
      if (input.trim()) setHistory((prev) => [...prev, input]);
      setInput("");
      setHistoryIdx(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const idx = historyIdx + 1;
      if (idx >= history.length) { setHistoryIdx(-1); setInput(""); }
      else { setHistoryIdx(idx); setInput(history[idx]); }
    }
  }

  const allHeader = [
    ...headerLines,
    ...(welcomeText ? [{ text: welcomeText, className: "text-muted" }] : []),
  ];

  return (
    <div className="terminal-container rounded-lg border border-border overflow-hidden shadow-2xl font-mono text-xs leading-tight" style={{ background: "#0a0a0f" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border" style={{ background: "#111115" }}>
        <div className="w-3 h-3 rounded-full" style={{ background: "#ff0040" }} />
        <div className="w-3 h-3 rounded-full" style={{ background: "#ffaa00" }} />
        <div className="w-3 h-3 rounded-full" style={{ background: "#00ff00" }} />
        <span className="ml-2 text-xs" style={{ color: "#666680" }}>runme — portfolio</span>
      </div>

      <div className="p-4 overflow-y-auto" style={{ maxHeight: "520px" }} ref={bottomRef}>
        {/* Permanent header — banner + welcome */}
        {allHeader.filter(Boolean).map((line, i) => (
          <div key={`h-${i}`} className={line.className || "text-fg"} style={{ whiteSpace: "pre" }}>
            {line.text || "\u00A0"}
          </div>
        ))}

        {/* Dynamic content — clears on each command */}
        {contentLines.filter(Boolean).map((line, i) => (
          <div key={`c-${i}`} className={line.className || "text-fg"} style={{ whiteSpace: "pre" }}>
            {line.text || "\u00A0"}
          </div>
        ))}

        {/* Prompt */}
        {phase === "input" && (
          <div className="flex items-center">
            <span style={{ color: "#ff00ff" }} className="mr-1">{"▸ "}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none"
              style={{ color: "#00ffff", caretColor: "#ff00ff" }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        )}

        {(phase === "banner" || phase === "welcome") && (
          <span className="inline-block w-2 h-4 animate-pulse" style={{ background: "#ff00ff" }} />
        )}
      </div>
    </div>
  );
}

const STEPS = [
  {
    number: "01",
    title: "Sign up",
    description: "Create your account in seconds. Pick a username.",
  },
  {
    number: "02",
    title: "Fill in your details",
    description: "Projects, experience, skills, theme. Everything lives in your dashboard.",
  },
  {
    number: "03",
    title: "Share your command",
    description: "Anyone runs npx @runme/yourname and sees your portfolio. In the terminal.",
  },
];

const FEATURES = [
  {
    title: "15 text animations",
    description: "Typewriter, matrix, glitch, neon glow, and more. Your portfolio loads with style.",
  },
  {
    title: "6 color themes",
    description: "Cyberpunk, Dracula, Gruvbox, Nord, Monokai, Tokyo Night. Or pick a custom hex.",
  },
  {
    title: "GitHub integration",
    description: "Repos, followers, contributions, top languages. Pulled automatically from the API.",
  },
  {
    title: "Works offline",
    description: "Portfolio data is cached locally. Your portfolio loads even without internet.",
  },
  {
    title: "Zero config",
    description: "No dotfiles. No YAML. Fill in the dashboard, run the command. Done.",
  },
  {
    title: "Open source",
    description: "MIT licensed. Inspect the code, fork it, contribute. The CLI is on GitHub.",
  },
];

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-fg font-bold text-lg tracking-tight">
            runme<span className="text-accent">.</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-muted hover:text-fg transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted hover:text-fg transition-colors">
              How it works
            </a>
            <Link
              href="/login"
              className="text-sm text-muted hover:text-fg transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="text-sm bg-fg text-bg px-4 py-1.5 rounded-md font-medium hover:bg-fg/90 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="pt-32 pb-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-accent text-sm font-mono mb-4 tracking-wider">
                DEVELOPER PORTFOLIOS, TERMINAL EDITION
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              Your portfolio.
              <br />
              <span className="text-muted">In the terminal.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted max-w-xl leading-relaxed"
            >
              One command. That&apos;s it. Share your username and anyone can see your
              projects, skills, and experience — right in their terminal.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex items-center gap-4"
            >
              <Link
                href="/login"
                className="bg-fg text-bg px-5 py-2.5 rounded-md font-medium text-sm hover:bg-fg/90 transition-colors"
              >
                Get started
              </Link>
              <a
                href="#how-it-works"
                className="text-sm text-muted hover:text-fg transition-colors"
              >
                See how it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10"
            >
              <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-md px-4 py-2.5 font-mono text-sm">
                <span className="text-muted">$</span>
                <span className="text-accent">npx @runme/</span>
                <span className="text-fg">yourname</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Terminal Preview */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <LiveTerminal />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accent text-sm font-mono mb-3 tracking-wider"
          >
            HOW IT WORKS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-16"
          >
            Three steps. No config files.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <span className="text-4xl font-bold text-border font-mono">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold mt-3 mb-2">{step.title}</h3>
                <p className="text-muted leading-relaxed text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accent text-sm font-mono mb-3 tracking-wider"
          >
            FEATURES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-16"
          >
            Everything you need. Nothing you don&apos;t.
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <h3 className="font-semibold text-fg mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          >
            Build yours in two minutes.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted mb-8"
          >
            Free. Open source. No account required to try the CLI.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="bg-fg text-bg px-6 py-2.5 rounded-md font-medium text-sm hover:bg-fg/90 transition-colors"
            >
              Login with GitHub
            </Link>
            <a
              href="https://github.com/shravan/runme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-fg transition-colors border border-border px-6 py-2.5 rounded-md"
            >
              View on GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted">
          <span>&copy; 2026 RunMe</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-fg transition-colors">GitHub</a>
            <a href="#" className="hover:text-fg transition-colors">Docs</a>
            <Link href="/login" className="hover:text-fg transition-colors">Log in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
