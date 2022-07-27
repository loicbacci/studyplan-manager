import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./database";
import { auth } from "./config";

export const updateSeason = (id: string, name: string) => {
  const toAdd: Partial<Season> = { name };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  console.log(toAdd);

  return updateDoc(
    doc(db, "users", auth.currentUser.uid, "seasons", id),
    toAdd
  );
};

export const addSeason = (name: string) => {
  let toAdd: Partial<Season> = {
    name,
  };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return addDoc(
    collection(db, "users", auth.currentUser.uid, "seasons"),
    toAdd
  );
};

export const deleteSeason = (id: string) => {
  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return deleteDoc(doc(db, "users", auth.currentUser.uid, "seasons", id));
};
