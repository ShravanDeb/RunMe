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
    const snapshot = await db.collection("experience").where("userId", "==", decoded.userId).orderBy("displayOrder").get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const decoded = await requireAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDb();
    const { company, role, startDate, endDate, description, location, isEducation } = await request.json();

    if (!company || !role || !startDate) {
      return NextResponse.json({ error: "Company, role, and start date are required" }, { status: 400 });
    }

    const expData = {
      userId: decoded.userId, company, role, startDate, endDate: endDate || "",
      description: description || "", location: location || "", isEducation: isEducation || false,
      displayOrder: 0, createdAt: new Date(), updatedAt: new Date(),
    };

    const docRef = await db.collection("experience").add(expData);
    return NextResponse.json({ id: docRef.id, ...expData }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
