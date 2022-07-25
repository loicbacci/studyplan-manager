import { doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "./database";
import { auth } from "./config";


export const updateCategory = (
  id: string,
  newCategory: Partial<Category>
) => {
  if (!auth.currentUser)
    return Promise.reject("The user is not authentificated");

  console.log(newCategory);

  return updateDoc(
    doc(db, "users", auth.currentUser.uid, "categories", id),
    newCategory
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
