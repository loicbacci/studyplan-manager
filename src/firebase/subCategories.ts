import { doc, addDoc, collection, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./database";
import { auth } from "./config";


export const updateSubCategory = (
  id: string,
  name: string,
  parentId: string,
  min_credits?: number,
  notes?: string
) => {
  let toAdd: Partial<SubCategory> = {
    name, parentId
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
    doc(db, "users", auth.currentUser.uid, "subcategories", id),
    toAdd
  );
};


export const addSubCategory = (
  name: string,
  parentId: string,
  min_credits?: number,
  notes?: string
) => {
  let toAdd: Partial<SubCategory> = {
    name, parentId
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
    collection(db, "users", auth.currentUser.uid, "subcategories"),
    toAdd
  );
};

export const deleteSubCategory = (id: string) => {
  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  return deleteDoc(doc(db, "users", auth.currentUser.uid, "subcategories", id));
}
