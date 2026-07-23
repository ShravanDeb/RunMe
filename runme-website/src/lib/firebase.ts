import { initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;
let db: Firestore;

function initFirebase(): Firestore {
  if (db) return db;

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
    });
  } else {
    app = initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "runme-e4b68" });
  }

  db = getFirestore(app);
  return db;
}

export function getDb(): Firestore {
  if (!db) initFirebase();
  return db;
}
