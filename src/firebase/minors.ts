import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./database";
import { auth } from "./config";

export const updateMinor = (id: string, name: string) => {
  const toAdd: Partial<Minor> = { name };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  console.log(toAdd);

  return updateDoc(
    doc(db, "users", auth.currentUser.uid, "minors", id),
    toAdd
  );
};

export const addMinor = (name: string) => {
  let toAdd: Partial<Minor> = {
    name,
  };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return addDoc(
    collection(db, "users", auth.currentUser.uid, "minors"),
    toAdd
  );
};

export const deleteMinor = (id: string) => {
  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return deleteDoc(doc(db, "users", auth.currentUser.uid, "minors", id));
};
