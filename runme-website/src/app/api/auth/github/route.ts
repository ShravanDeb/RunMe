import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?error=github_not_configured", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: "read:user user:email",
    allow_signup: "false",
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
}
