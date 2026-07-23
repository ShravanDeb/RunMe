import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const db = getDb();
    const userSnapshot = await db.collection("users").where("username", "==", username).limit(1).get();
    if (userSnapshot.empty) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userId = userSnapshot.docs[0].id;
    const profileDoc = await db.collection("users").doc(userId).get();
    if (!profileDoc.exists) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json(profileDoc.data());
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
