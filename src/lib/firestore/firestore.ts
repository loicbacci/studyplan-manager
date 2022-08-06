import { getFirestore, QuerySnapshot, DocumentData } from "firebase/firestore";
import { app } from "../app";

export const db = getFirestore(app);

export const addId = <T extends { id: string }>(snapshot: QuerySnapshot) => {
  const elems: T[] = [];

  snapshot.forEach(doc => {
    elems.push({ id: doc.id, ...doc.data() } as T);
  });

  return elems;
}
