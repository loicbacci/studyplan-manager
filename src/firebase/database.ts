import { collection, doc, getFirestore } from "firebase/firestore";
import { app } from "@/firebase/config";
import { auth } from "@/firebase/auth";

export const db = getFirestore(app);

export const collectionRef = (collectionPath: string) => {
  if (!auth.currentUser) throw new Error("User not authentificated");

  return collection(db, "users", auth.currentUser.uid, collectionPath);
};

export const docRef = (docPath: string) => {
  if (!auth.currentUser) throw new Error("User not authentificated");

  return doc(db, "users", auth.currentUser.uid, docPath);
};
