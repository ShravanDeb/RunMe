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
    const doc = await db.collection("experience").doc(id).get();
    if (!doc.exists || doc.data()?.userId !== decoded.userId) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    const body = await request.json();
    const updateData: Record<string, any> = { updatedAt: new Date() };
    for (const key of ["company", "role", "startDate", "endDate", "description", "location", "isEducation", "displayOrder"]) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    await db.collection("experience").doc(id).update(updateData);
    return NextResponse.json({ message: "Experience updated" });
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
    const doc = await db.collection("experience").doc(id).get();
    if (!doc.exists || doc.data()?.userId !== decoded.userId) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    await db.collection("experience").doc(id).delete();
    return NextResponse.json({ message: "Experience deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
