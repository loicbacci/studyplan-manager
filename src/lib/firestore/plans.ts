import { useCollection, useDoc, useFunctions } from "./firestoreUtils";

export const usePlans = () => {
  return {
    plans: useCollection<Plan>("plans"),
    ...useFunctions<Plan>("plans")
  };
}

export const usePlan = (planId: string) => {
  return {
    plan: useDoc<Plan>(`plans/${planId}`)
  }
}

export const useTakenCourses = (planId: string) => {
  return {
    takenCoursesData: useCollection<TakenCourseData>(`plans/${planId}/taken_courses`),
    ...useFunctions<TakenCourseData>(`plans/${planId}/taken_courses`)
  }
}