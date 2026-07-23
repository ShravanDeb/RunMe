import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

async function requireAuth(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request: Request) {
  const decoded = await requireAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDb();
    const profileDoc = await db.collection("users").doc(decoded.userId).get();
    const profile = profileDoc.data();

    if (!profile?.githubUrl) {
      return NextResponse.json({ error: "GitHub URL not set in profile" }, { status: 400 });
    }

    const match = profile.githubUrl.match(/github\.com\/([^/]+)/);
    if (!match) return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });

    const githubUsername = match[1];
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = token ? { Authorization: `token ${token}` } : {};

    const [userRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUsername}`, { headers }),
      fetch(`https://api.github.com/users/${githubUsername}/events/public?per_page=30`, { headers }),
    ]);

    const userData = await userRes.json() as any;
    const eventsData = await eventsRes.json() as any[];

    const contributions = eventsData.filter((e: any) => e.type === "PushEvent").length;

    const topLanguages = await getTopLanguages(githubUsername, headers);

    const recentActivity = eventsData.slice(0, 10).map((event: any) => ({
      type: event.type.replace("Event", "").toLowerCase(),
      repo: event.repo.name,
      date: event.created_at,
    }));

    const stats = {
      userId: decoded.userId, username: githubUsername,
      publicRepos: userData.public_repos, followers: userData.followers, following: userData.following,
      contributions, topLanguages, recentActivity,
      lastFetched: new Date(), updatedAt: new Date(),
    };

    await db.collection("githubStats").doc(decoded.userId).set(stats, { merge: true });
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getTopLanguages(username: string, headers: Record<string, string>) {
  try {
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=10&sort=updated`, { headers });
    const repos = await reposRes.json() as any[];
    const langCounts: Record<string, number> = {};

    for (const repo of repos.slice(0, 5)) {
      try {
        const langRes = await fetch(repo.languages_url, { headers });
        const langs = await langRes.json() as Record<string, number>;
        for (const [lang, bytes] of Object.entries(langs)) {
          langCounts[lang] = (langCounts[lang] || 0) + bytes;
        }
      } catch { /* skip */ }
    }

    const total = Object.values(langCounts).reduce((a, b) => a + b, 0);
    return Object.entries(langCounts)
      .map(([name, bytes]) => ({ name, percentage: Math.round((bytes / total) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  } catch {
    return [];
  }
}
