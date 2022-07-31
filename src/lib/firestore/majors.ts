import { useCollection, useDoc, useFunctions } from "./firestoreUtils";

export const useMajors = (programmeId: string) => {
  return {
    majors: useCollection<Major>(`programmes/${programmeId}/majors`),
    ...useFunctions<Major>(`programmes/${programmeId}/majors`)
  }
}

export const useMajor = (programmeId: string, majorId: string) => {
  return {
    major: useDoc<Major>(`programmes/${programmeId}/majors/${majorId}`)
  }
}