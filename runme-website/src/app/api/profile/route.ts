import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) return NextResponse.json({ error: "No token provided" }, { status: 401 });

  const decoded = await verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    const db = getDb();
    const doc = await db.collection("profiles").doc(decoded.userId).get();
    if (!doc.exists) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json(doc.data());
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) return NextResponse.json({ error: "No token provided" }, { status: 401 });

  const decoded = await verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    const db = getDb();
    const body = await request.json();

    const profileData = {
      userId: decoded.userId,
      name: body.name,
      title: body.title,
      bio: body.bio,
      phone: body.phone,
      githubUrl: body.githubUrl,
      linkedinUrl: body.linkedinUrl,
      portfolioUrl: body.portfolioUrl,
      location: body.location,
      availableForHire: body.availableForHire,
      responseTime: body.responseTime,
      timezone: body.timezone,
      updatedAt: new Date(),
    };

    await db.collection("profiles").doc(decoded.userId).set(profileData, { merge: true });

    if (body.email) {
      await db.collection("users").doc(decoded.userId).update({ email: body.email, updatedAt: new Date() });
    }

    return NextResponse.json({ message: "Profile updated" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
