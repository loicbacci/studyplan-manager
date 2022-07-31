import { useCollection, useDoc, useFunctions } from "./firestoreUtils";

export const useMinors = (programmeId: string) => {
  return {
    minors: useCollection<Minor>(`programmes/${programmeId}/minors`),
    ...useFunctions<Minor>(`programmes/${programmeId}/minors`)
  }
}