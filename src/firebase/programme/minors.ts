import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../database";
import { auth } from "../config";

const updateMinor = (programmeId: string) => (id: string, name: string) => {
  const toAdd: Partial<Minor> = { name };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  console.log(toAdd);

  return updateDoc(
    doc(db, "users", auth.currentUser.uid, "programmes", programmeId, "minors", id),
    toAdd
  );
};

const addMinor = (programmeId: string) => (name: string) => {
  let toAdd: Partial<Minor> = {
    name,
  };

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return addDoc(
    collection(db, "users", auth.currentUser.uid, "programmes", programmeId,"minors"),
    toAdd
  );
};

const deleteMinor = (programmeId: string) => (id: string) => {
  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return deleteDoc(doc(db, "users", auth.currentUser.uid, "programmes", programmeId,"minors", id));
};

const minorFunctions = (programmeId: string) => {
  return {
    updateMinor: updateMinor(programmeId),
    addMinor: addMinor(programmeId),
    deleteMinor: deleteMinor(programmeId)
  }
}

export default minorFunctions;
