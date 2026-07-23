"use client";

import Link from "next/link";
import { useState } from "react";

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  function handleGithubLogin() {
    setLoading(true);
    window.location.href = "/api/auth/github";
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link href="/" className="text-fg font-bold text-lg tracking-tight">
            runme<span className="text-accent">.</span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h1>
        <p className="text-sm text-muted mb-8">
          Log in with GitHub to manage your portfolio.
        </p>

        <button
          onClick={handleGithubLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-fg text-bg py-2.5 rounded-md text-sm font-medium hover:bg-fg/90 transition-colors disabled:opacity-50"
        >
          <GithubIcon />
          {loading ? "Redirecting to GitHub..." : "Login with GitHub"}
        </button>

        <div className="mt-10 text-center">
          <p className="text-xs text-muted">
            Your GitHub username becomes your portfolio command:
          </p>
          <code className="text-xs text-accent font-mono mt-1 inline-block">
            npx @runme/your-github-username
          </code>
        </div>
      </div>
    </div>
  );
}
