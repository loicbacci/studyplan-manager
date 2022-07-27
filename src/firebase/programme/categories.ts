import { doc, addDoc, collection, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../database";
import { auth } from "../config";


export const updateCategory = (
  id: string,
  name: string,
  min_credits?: number,
  notes?: string
) => {
  let toAdd: Partial<Category> = {
    name,
  };

  if (min_credits) {
    toAdd = { ...toAdd, min_credits };
  }

  if (notes) {
    toAdd = { ...toAdd, notes };
  }

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  console.log(toAdd);

  return updateDoc(
    doc(db, "users", auth.currentUser.uid, "categories", id),
    toAdd
  );
};


export const addCategory = (
  name: string,
  min_credits?: number,
  notes?: string
) => {
  let toAdd: Partial<Category> = {
    name,
  };

  if (min_credits) {
    toAdd = { ...toAdd, min_credits };
  }

  if (notes) {
    toAdd = { ...toAdd, notes };
  }

  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return addDoc(
    collection(db, "users", auth.currentUser.uid, "categories"),
    toAdd
  );
};

export const deleteCategory = (id: string) => {
  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return deleteDoc(doc(db, "users", auth.currentUser.uid, "categories", id));
}
