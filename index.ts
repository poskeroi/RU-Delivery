import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("🎉 Backend is working!");
});

export const createUserProfile = functions.auth.user().onCreate(async (user) => {
  const userRef = db.collection("users").doc(user.uid);
  await userRef.set({
    email: user.email,
    role: "buyer",
    campusHome: "Unknown",
    verifiedDorm: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("✅ User created:", user.email);
});
