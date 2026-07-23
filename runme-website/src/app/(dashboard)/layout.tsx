"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api, getToken, clearToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/profile", label: "Profile" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/journey", label: "Journey" },
  { href: "/theme", label: "Theme" },
  { href: "/settings", label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    api.profile
      .get()
      .then((res) => setUsername(res.username))
      .catch(() => {
        clearToken();
        router.push("/login");
      });
  }, [router]);

  function handleLogout() {
    clearToken();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-56 border-r border-border flex flex-col fixed h-screen">
        <div className="px-4 py-4 border-b border-border">
          <Link href="/" className="text-fg font-bold text-sm tracking-tight">
            runme<span className="text-accent">.</span>
          </Link>
          {username && (
            <p className="text-xs text-muted mt-1 font-mono">@{username}</p>
          )}
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === item.href
                  ? "bg-surface text-fg"
                  : "text-muted hover:text-fg hover:bg-surface/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-1.5 rounded-md text-sm text-muted hover:text-error transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-56 p-8">{children}</main>
    </div>
  );
}
