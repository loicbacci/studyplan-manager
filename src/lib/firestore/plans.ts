import { useCollection, useDoc, useFunctions } from "./firestoreUtils";
import { doc, arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { useAuth } from "../auth";
import { db } from "./firestore";

export const usePlans = () => {

  return {
    plans: useCollection<Plan>("plans"),
    ...useFunctions<Plan>("plans")
  };
}

export const usePlan = (planId: string) => {
  const { userId } = useAuth();

  const planRef = doc(db, "users", userId ? userId : "", "plans", planId);
  const takeCourse = (courseId: string, take: boolean) => {
    if (take) {
      return updateDoc(planRef, {
        chosen_courses_ids: arrayUnion(courseId)
      });
    } else {
      return updateDoc(planRef, {
        chosen_courses_ids: arrayRemove(courseId)
      })
    }
  }

  return {
    plan: useDoc<Plan>(`plans/${planId}`),
    takeCourse
  }
}