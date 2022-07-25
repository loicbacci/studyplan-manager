import { useEffect, useRef, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { app, useAuth } from "./config";

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
    categories: useCollection<Category>("categories"),
    seasons: useCollection<Season>("seasons"),
    semesters: useCollection<Semester>("semesters"),
    subcategories: useCollection<SubCategory>("subcategories"),
    courses: useCollection<Course>("courses"),
  };
};

export const setupUser = (userId: string) => {

}
