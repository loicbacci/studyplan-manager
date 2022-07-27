import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../database";
import { auth } from "../config";

const updateMajor = (programmeId: string) => (id: string, name: string) => {
  const toAdd: Partial<Minor> = { name };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  console.log(toAdd);

  return updateDoc(
    doc(db, "users", auth.currentUser.uid, "programmes", programmeId, "majors", id),
    toAdd
  );
};

const addMajor = (programmeId: string) => (name: string) => {
  let toAdd: Partial<Minor> = {
    name,
  };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return addDoc(
    collection(db, "users", auth.currentUser.uid, "programmes", programmeId, "majors"),
    toAdd
  );
};

const deleteMajor = (programmeId: string) => (id: string) => {
  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return deleteDoc(doc(db, "users", auth.currentUser.uid, "programmes", programmeId, "majors", id));
};

const majorFunctions = (programmeId: string) => {
  return {
    updateMajor: updateMajor(programmeId),
    addMajor: addMajor(programmeId),
    deleteMajor: deleteMajor(programmeId)
  }
}

export default majorFunctions;
