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
    const doc = await db.collection("themes").doc(decoded.userId).get();
    if (!doc.exists) return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    return NextResponse.json(doc.data());
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const decoded = await requireAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDb();
    const body = await request.json();

    const themeData: Record<string, any> = { userId: decoded.userId, updatedAt: new Date() };
    for (const key of ["lockedTheme", "customHexColor", "gradientColor", "asciiBanner", "bootAnimation", "greeting"]) {
      if (body[key] !== undefined) themeData[key] = body[key];
    }

    await db.collection("themes").doc(decoded.userId).set(themeData, { merge: true });
    return NextResponse.json({ message: "Theme updated" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
