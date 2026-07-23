"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, clearToken } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    api.profile
      .get()
      .then((res) => setUsername(res.username))
      .catch(() => {});
  }, [router]);

  async function refreshGithub() {
    setRefreshing(true);
    setRefreshed(false);
    try {
      await api.github.refresh();
      setRefreshed(true);
      setTimeout(() => setRefreshed(false), 2000);
    } catch {
    } finally {
      setRefreshing(false);
    }
  }

  function handleLogout() {
    clearToken();
    router.push("/");
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-muted">Account and data management.</p>
      </div>

      <div className="space-y-8">
        {/* Portfolio command */}
        <section>
          <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
            Your portfolio command
          </h2>
          <div className="bg-surface border border-border rounded-lg p-4">
            <code className="text-sm font-mono">
              <span className="text-accent">npx @runme/</span>
              <span className="text-fg">{username || "..."}</span>
            </code>
            <p className="text-xs text-muted mt-2">
              Share this command with anyone. They&apos;ll see your portfolio in their terminal.
            </p>
          </div>
        </section>

        {/* GitHub data */}
        <section>
          <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
            GitHub data
          </h2>
          <div className="bg-surface border border-border rounded-lg p-4">
            <p className="text-sm text-muted mb-3">
              Your GitHub stats (repos, followers, contributions) are cached for 24 hours.
              Force a refresh to pull the latest.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshGithub}
                disabled={refreshing}
                className="bg-surface border border-border px-4 py-1.5 rounded-md text-sm text-fg hover:bg-border transition-colors disabled:opacity-50"
              >
                {refreshing ? "Refreshing..." : "Refresh GitHub data"}
              </button>
              {refreshed && <span className="text-success text-sm">Refreshed</span>}
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <h2 className="text-xs text-error uppercase tracking-wider mb-3">
            Account
          </h2>
          <div className="bg-surface border border-error/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Log out</p>
                <p className="text-xs text-muted mt-0.5">
                  You&apos;ll need to log in again to access your dashboard.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-error hover:text-error/80 border border-error/30 px-4 py-1.5 rounded-md transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
