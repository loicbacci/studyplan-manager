import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./database";
import { auth } from "./config";

export const updateSemester = (id: string, name: string) => {
  const toAdd: Partial<Semester> = { name };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  console.log(toAdd);

  return updateDoc(
    doc(db, "users", auth.currentUser.uid, "semesters", id),
    toAdd
  );
};

export const addSemester = (name: string) => {
  let toAdd: Partial<Semester> = {
    name,
  };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return addDoc(
    collection(db, "users", auth.currentUser.uid, "semesters"),
    toAdd
  );
};

export const deleteSemester = (id: string) => {
  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return deleteDoc(doc(db, "users", auth.currentUser.uid, "semesters", id));
};
