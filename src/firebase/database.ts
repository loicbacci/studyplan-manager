import { useEffect, useState } from "react";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "./config";

const db = getFirestore(app);

export const useCollection = <T extends BaseData>(collectionName: string): T[] | null => {
  const [elems, setElems] = useState(null as T[] | null);

  useEffect(() => {
    onSnapshot(
      collection(db, collectionName),
      snapshot => {
        const cs = [] as T[];
        snapshot.forEach(doc => {
          const cat = {
            id: doc.id,
            ...doc.data()
          }
          cs.push(cat as T)
        });
        setElems(cs);
      },
      () => setElems(null)
    );
  })
  
  return elems;
}

export const useDatabase = () => {
  return {
    categories: useCollection<Category>("categories"),
    seasons: useCollection<Season>("seasons"),
    semesters: useCollection<Semester>("semesters"),
    subcategories: useCollection<SubCategory>("subcategories"),
    courses: useCollection<Course>("courses")
  }
}