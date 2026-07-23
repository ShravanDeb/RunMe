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
    const snapshot = await db.collection("skills").where("userId", "==", decoded.userId).orderBy("displayOrder").get();
    const skills = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const decoded = await requireAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDb();
    const { categoryName, description, skills, skillLevel } = await request.json();

    if (!categoryName || !skills) {
      return NextResponse.json({ error: "Category name and skills are required" }, { status: 400 });
    }

    const skillData = {
      userId: decoded.userId, categoryName, description: description || "",
      skills, skillLevel: skillLevel || "intermediate",
      displayOrder: 0, createdAt: new Date(), updatedAt: new Date(),
    };

    const docRef = await db.collection("skills").add(skillData);
    return NextResponse.json({ id: docRef.id, ...skillData }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
