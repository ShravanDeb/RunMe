import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import type { PortfolioData } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const db = getDb();

    const userSnapshot = await db.collection("users").where("username", "==", username).limit(1).get();
    if (userSnapshot.empty) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });

    const userId = userSnapshot.docs[0].id;

    const [profileDoc, projectsSnap, experienceSnap, skillsSnap, themeDoc, githubDoc] = await Promise.all([
      db.collection("users").doc(userId).get(),
      db.collection("projects").where("userId", "==", userId).get(),
      db.collection("experience").where("userId", "==", userId).get(),
      db.collection("skills").where("userId", "==", userId).get(),
      db.collection("themes").doc(userId).get(),
      db.collection("githubStats").doc(userId).get(),
    ]);

    const profile = profileDoc.data();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const theme = themeDoc.data() || { lockedTheme: "cyberpunk" };
    const github = githubDoc.data() || undefined;

    const portfolio: PortfolioData = {
      profile: {
        name: profile.name || "", title: profile.title || "", bio: profile.bio || "",
        email: profile.email || "", phone: profile.phone || "", githubUrl: profile.github || "",
        linkedinUrl: profile.linkedin || "", portfolioUrl: profile.website || "",
        location: profile.location || "", availableForHire: profile.availableForHire || false,
        responseTime: profile.responseTime || "", timezone: profile.timezone || "",
      },
      projects: projectsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PortfolioData["projects"][0])),
      experience: experienceSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PortfolioData["experience"][0])),
      skills: skillsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PortfolioData["skills"][0])),
      theme: {
        lockedTheme: theme.lockedTheme || "cyberpunk", customHexColor: theme.customHexColor,
        gradientColor: theme.gradientColor,
        asciiBanner: theme.asciiBanner, bootAnimation: theme.bootAnimation || "typewriter",
        greeting: theme.greeting,
      },
      github: github as PortfolioData["github"] | undefined,
    };

    return NextResponse.json(portfolio);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
