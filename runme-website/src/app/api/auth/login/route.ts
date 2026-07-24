import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { emailOrUsername, password } = await request.json();

    if (!emailOrUsername || !password) {
      return NextResponse.json({ error: "Email/username and password are required" }, { status: 400 });
    }

    const db = getDb();
    let userDoc;

    if (emailOrUsername.includes("@")) {
      const snapshot = await db.collection("users").where("email", "==", emailOrUsername).limit(1).get();
      userDoc = snapshot.docs[0];
    } else {
      const snapshot = await db.collection("users").where("username", "==", emailOrUsername).limit(1).get();
      userDoc = snapshot.docs[0];
    }

    if (!userDoc) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const user = userDoc.data();
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const token = await signToken({ userId: userDoc.id });

    return NextResponse.json({
      user: { id: userDoc.id, username: user.username, email: user.email },
      token,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 400 });
  }
}
