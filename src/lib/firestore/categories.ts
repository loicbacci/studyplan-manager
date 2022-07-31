import { useCollection, useFunctions } from "./firestoreUtils";

export const useCategories = (programmeId: string) => {
  return {
    categories: useCollection<Category>(`programmes/${programmeId}/categories`),
    ...useFunctions<Category>(`programmes/${programmeId}/categories`)
  }
}