import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { getDb } from "@/lib/firebase";

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  location: string | null;
  blog: string | null;
}

async function exchangeCode(code: string): Promise<string> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error_description || "GitHub OAuth failed");
  return data.access_token;
}

async function fetchGitHubUser(token: string): Promise<GitHubUser> {
  const res = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch GitHub user");
  return res.json();
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${error}`, baseUrl));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", baseUrl));
  }

  try {
    const accessToken = await exchangeCode(code);
    const githubUser = await fetchGitHubUser(accessToken);

    const db = getDb();
    const usersRef = db.collection("users");

    // Check if user exists by githubId
    const existing = await usersRef.where("githubId", "==", String(githubUser.id)).limit(1).get();

    let userId: string;
    let username: string;

    if (!existing.empty) {
      const doc = existing.docs[0];
      userId = doc.id;
      const data = doc.data();
      username = data.username;

      // Update existing user
      await doc.ref.update({
        name: githubUser.name || githubUser.login,
        email: githubUser.email || data.email,
        avatarUrl: githubUser.avatar_url,
        bio: githubUser.bio || data.bio,
        location: githubUser.location || data.location,
        website: githubUser.blog || data.website,
        github: `https://github.com/${githubUser.login}`,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // New user — use GitHub login as username
      const usernameCheck = await usersRef.where("username", "==", githubUser.login).limit(1).get();
      if (!usernameCheck.empty) {
        // Username taken — append random suffix
        username = `${githubUser.login}-${githubUser.id}`;
      } else {
        username = githubUser.login;
      }

      const docRef = await usersRef.add({
        username,
        githubId: String(githubUser.id),
        name: githubUser.name || githubUser.login,
        email: githubUser.email || "",
        avatarUrl: githubUser.avatar_url,
        bio: githubUser.bio || "",
        location: githubUser.location || "",
        website: githubUser.blog || "",
        github: `https://github.com/${githubUser.login}`,
        title: "",
        phone: "",
        linkedin: "",
        availableForHire: false,
        responseTime: "",
        timezone: "",
        projects: [],
        experience: [],
        skills: [],
        theme: {
          name: "cyberpunk",
          animations: "typewriter",
          customColor: null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      userId = docRef.id;
    }

    const token = await signToken({ userId });

    // Redirect to dashboard with token in cookie
    const response = NextResponse.redirect(new URL("/profile", baseUrl));
    response.cookies.set("runme_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("GitHub OAuth error:", err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message || "auth_failed")}`, baseUrl)
    );
  }
}
