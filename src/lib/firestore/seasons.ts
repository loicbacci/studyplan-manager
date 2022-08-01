import { useCollection, useFunctions } from "./firestoreUtils";

export const useSeasons = (programmeId: string) => {
  return {
    seasons: useCollection<Season>(`programmes/${programmeId}/seasons`),
    ...useFunctions<Season>(`programmes/${programmeId}/seasons`)
  }
}