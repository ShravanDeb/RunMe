import { initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import fs from "fs";

let app: App;
let db: Firestore;

function initFirebase(): Firestore {
  if (db) return db;

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
    app = initializeApp({ credential: cert(serviceAccount) });
  } else {
    app = initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "runme-portfolio" });
  }

  db = getFirestore(app);
  return db;
}

export function getDb(): Firestore {
  if (!db) initFirebase();
  return db;
}
