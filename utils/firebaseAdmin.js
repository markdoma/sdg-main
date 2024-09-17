// lib/firebaseAdmin.js
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://<your-database-name>.firebaseio.com",
  });
}

export const auth_server = admin.auth();
export const db_server = admin.firestore();
