import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../database";
import { auth } from "../config";

export const updateProgramme = (id: string, name: string) => {
  const toAdd: Omit<ProgrammeStructure, "id"> = { name };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  console.log(toAdd);

  return updateDoc(
    doc(db, "users", auth.currentUser.uid, "programmes",id),
    toAdd
  );
};

export const addProgramme = (name: string) => {
  let toAdd: Omit<ProgrammeStructure, "id">  = {
    name,
  };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return addDoc(
    collection(db, "users", auth.currentUser.uid, "programmes"),
    toAdd
  );
};

export const deleteProgramme = (id: string) => {
  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return deleteDoc(doc(db, "users", auth.currentUser.uid, "programmes", id));
};
