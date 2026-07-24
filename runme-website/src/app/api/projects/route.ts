import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

async function requireAuth(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: Request) {
  const decoded = await requireAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDb();
    const snapshot = await db.collection("projects").where("userId", "==", decoded.userId).get();
    const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const decoded = await requireAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDb();
    const { title, subtitle, description, tags, liveDemoUrl, githubRepoUrl, projectColor, featured } = await request.json();

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const projectData = {
      userId: decoded.userId, title, subtitle: subtitle || "", description: description || "",
      tags: tags || [], liveDemoUrl: liveDemoUrl || "", githubRepoUrl: githubRepoUrl || "",
      projectColor: projectColor || "", featured: featured || false, displayOrder: 0, createdAt: new Date(), updatedAt: new Date(),
    };

    const docRef = await db.collection("projects").add(projectData);
    return NextResponse.json({ id: docRef.id, ...projectData }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
