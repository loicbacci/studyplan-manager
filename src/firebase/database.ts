import { useEffect, useRef, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { app, useAuth } from "./config";
import minorFunctions from "./programme/minors";

export const db = getFirestore(app);

export const useCollection = <T extends BaseData>(
  collectionName: string
): T[] | null => {
  const [elems, setElems] = useState(null as T[] | null);
  const lastSnapshotRef = useRef(null as Unsubscribe | null);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    if (lastSnapshotRef.current) lastSnapshotRef.current();

    const snap = onSnapshot(
      collection(db, "users", userId, collectionName),
      (snapshot) => {
        const cs = [] as T[];
        snapshot.forEach((doc) => {
          const cat = {
            id: doc.id,
            ...doc.data(),
          };
          cs.push(cat as T);
        });
        setElems(cs);
      },
      () => setElems(null)
    );

    lastSnapshotRef.current = snap;
  }, [userId, collectionName]);

  return elems;
};

export const useDatabase = () => {
  return {
    programmes: useCollection<ProgrammeStructure>("programmes"),

    categories: useCollection<Category>("categories"),
    seasons: useCollection<Season>("seasons"),
    semesters: useCollection<Semester>("semesters"),
    subcategories: useCollection<SubCategory>("subcategories"),
    courses: useCollection<Course>("courses"),
    minors: useCollection<Course>("minors"),

  };
};

export const useProgramme = (programmeId: string) => {
  const { programmes } = useDatabase();

  return {
    programme: programmes && programmes.find(p => p.id === programmeId),
    categories: useCollection<Category>(`programmes/${programmeId}/categories`),
    majors: useCollection<Major>(`programmes/${programmeId}/majors`),
    minors: useCollection<Minor>(`programmes/${programmeId}/minors`),

    minorFunctions: minorFunctions(programmeId)
  }
}

export const useCategory = (programmeId: string, categoryId: string) => {
  return {
    subcategories: useCollection<SubCategory>(`programmes/${programmeId}/categories/${categoryId}/subcategories`)
  }
}