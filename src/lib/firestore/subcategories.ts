import { useCollection, useFunctions } from "./firestoreUtils";

export const useSubCategories = (programmeId: string, categoryId: string) => {
  return {
    subcategories: useCollection<SubCategory>(
      `programmes/${programmeId}/categories/${categoryId}/subcategories`
    ),
    ...useFunctions<SubCategory>(
      `programmes/${programmeId}/categories/${categoryId}/subcategories`
    )
  }
}