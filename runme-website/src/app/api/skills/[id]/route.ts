import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

async function requireAuth(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = await requireAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const db = getDb();
    const doc = await db.collection("skills").doc(id).get();
    if (!doc.exists || doc.data()?.userId !== decoded.userId) {
      return NextResponse.json({ error: "Skill category not found" }, { status: 404 });
    }

    const body = await request.json();
    const updateData: Record<string, any> = { updatedAt: new Date() };
    for (const key of ["categoryName", "description", "skills", "skillLevel", "displayOrder"]) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    await db.collection("skills").doc(id).update(updateData);
    return NextResponse.json({ message: "Skill category updated" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = await requireAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const db = getDb();
    const doc = await db.collection("skills").doc(id).get();
    if (!doc.exists || doc.data()?.userId !== decoded.userId) {
      return NextResponse.json({ error: "Skill category not found" }, { status: 404 });
    }

    await db.collection("skills").doc(id).delete();
    return NextResponse.json({ message: "Skill category deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
