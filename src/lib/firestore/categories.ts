import { useCollection, useFunctions } from "./firestoreUtils";
import { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "./firestore";
import { useAuth } from "../auth";

export const useCategories = (programmeId: string) => {
  return {
    categories: useCollection<Category>(`programmes/${programmeId}/categories`),
    ...useFunctions<Category>(`programmes/${programmeId}/categories`)
  }
}

export const useCategoriesData = (programmeId: string) => {
  const [categoriesData, setCategoriesData] = useState(null as CategoryData[] | null);
  const { categories } = useCategories(programmeId);
  const { userId } = useAuth();

  useEffect(() => {
    if (!categories || !userId) return;

    const basePromises = categories.map(c => getDocs(
      collection(db, "users", userId, `programmes/${programmeId}/categories/${c.id}/subcategories`),
    ).then(snapshot => {
      return { category: c, snapshot }
    }));

    Promise.all(basePromises).then(res => {
      return res.map(({ category, snapshot }) => {
        const subCategories: SubCategory[] = [];

        snapshot.forEach(doc => {
          const subCategory = {
            id: doc.id,
            ...doc.data()
          } as SubCategory;

          subCategories.push(subCategory);
        })

        const categoryData: CategoryData = {
          category,
          subCategories: subCategories.length === 0 ? undefined : subCategories
        }

        return categoryData;
      })
    }).then(setCategoriesData)
  }, [categories, userId]);

  return { categoriesData }
}
