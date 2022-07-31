import { useEffect, useRef, useState } from "react";
import {
  addDoc as addDocF,
  collection,
  deleteDoc as deleteDocF,
  doc,
  onSnapshot,
  Unsubscribe,
  updateDoc as updateDocF,
  DocumentReference,
  DocumentData
} from "firebase/firestore";
import { useAuth } from "../auth";
import { db } from "./firestore";
import { removeUndefined } from "../firebaseUtils";

export const useCollection = <T extends BaseData>(collectionName: string): T[] | null => {
  const [elems, setElems] = useState(null as T[] | null);
  const lastUnsubscribe = useRef(null as Unsubscribe | null);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    if (lastUnsubscribe.current) lastUnsubscribe.current();

    lastUnsubscribe.current = onSnapshot(
      collection(db, "users", userId, collectionName),
      (snapshot) => {
        const cs = [] as T[];
        snapshot.forEach((doc) => {
          const cat: T = {
            id: doc.id,
            ...doc.data(),
          } as T;
          cs.push(cat);
        });
        setElems(cs);
      },
      () => setElems(null)
    );
  }, [userId, collectionName]);

  return elems;
};

export const useDoc = <T extends BaseData>(docPath: string): T | null => {
  const [elem, setElem] = useState(null as T | null);
  const lastUnsubscribe = useRef(null as Unsubscribe | null);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;
    if (lastUnsubscribe.current) lastUnsubscribe.current();

    lastUnsubscribe.current = onSnapshot(
      doc(db, "users", userId, docPath),
      (snapshot) => {

        const data: T = {
          id: snapshot.id,
          ...snapshot.data()
        } as T;

        setElem(data);
      },
      () => setElem(null)
    );

  }, [userId, docPath])

  return elem;
}

export const updateDoc = <T>(userId: string, docPath: string, newDoc: NonNullable<T>) => {
  const remUndefDoc = removeUndefined(newDoc as any);
  return updateDocF(
    doc(db, "users", userId, docPath),
    remUndefDoc
  )
}

export const addDoc = <T>(userId: string, collectionPath: string, newDoc: T) => {
  const remUndefDoc = removeUndefined(newDoc as any);
  return addDocF(
    collection(db, "users", userId, collectionPath),
    remUndefDoc
  )
}

export const deleteDoc = (userId: string, docPath: string) => {
  return deleteDocF(doc(db, "users", userId, docPath));
}


export const useFunctions = <T extends BaseData>(collectionPath: string) => {
  const { userId } = useAuth();

  const [update, setUpdate] = useState((() => () => {
  }) as any);
  const [add, setAdd] = useState((() => () => {
  }) as any);
  const [remove, setRemove] = useState((() => () => {
  }) as any);


  useEffect(() => {
    if (!userId) return;

    const removeId = (doc: T): Omit<T, "id"> => {
      const newDoc: any = doc;
      delete newDoc.id;
      return newDoc as Omit<T, "id">;
    }

    const getDocPath = (docId: string) => {
      return `${collectionPath}/${docId}`
    }

    const newUpdate = (newDoc: T) => {
      return updateDoc(userId, getDocPath(newDoc.id), removeId(newDoc))
    }

    const newAdd = (newDoc: Omit<T, "id">) => {
      return addDoc<Omit<T, "id">>(userId, collectionPath, newDoc)
    }

    const newRemove = (docId: string) => {
      return deleteDoc(userId, getDocPath(docId))
    }

    setUpdate(() => newUpdate);
    setAdd(() => newAdd);
    setRemove(() => newRemove);
  }, [collectionPath, userId])


  return {
    update: update as (newDoc: T) => Promise<void>,
    add: add as (newDoc: Omit<T, "id">) => Promise<DocumentReference<DocumentData>>,
    remove: remove as (docId: string) => Promise<void>
  };
}