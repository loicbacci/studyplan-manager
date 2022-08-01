import { useCollection, useFunctions } from "./firestoreUtils";

export const useSemesters = (programmeId: string) => {
  return {
    semesters: useCollection<Semester>(`programmes/${programmeId}/semesters`),
    ...useFunctions<Semester>(`programmes/${programmeId}/semesters`)
  }
}