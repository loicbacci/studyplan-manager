import { useCollection, useFunctions } from "./firestoreUtils";

export const useCourses = (programmeId: string) => {
  return {
    courses: useCollection<Course>(`programmes/${programmeId}/courses`),
    ...useFunctions<Course>(`programmes/${programmeId}/courses`)
  }
}