import React from "react";
import { Heading, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddSubCategoryButton, SubCategoriesListEntry } from "./SubCategoriesListEntry";
import { useProgramme } from "../../lib/firestore/programmes";
import { useCategories } from "../../lib/firestore/categories";
import { useSubCategories } from "../../lib/firestore/subcategories";
import { FiCornerDownRight } from "react-icons/all";


interface SubCategoriesListProps {
  programmeId: string,
  categoryId: string
}

const SubCategoriesList = (props: SubCategoriesListProps) => {
  const { programmeId, categoryId } = props;

  const { subcategories, add, update, remove } = useSubCategories(programmeId, categoryId);
  const toast = useToast();


  const addSubCategory = (name: string, minCredits?: number, notes?: string) => {
    const elem: Omit<SubCategory, "id"> = {
      name,
      min_credits: minCredits,
      notes
    }

    add(elem)
      .then(() => toast(toastSuccessOptions("Successfully added sub category")))
      .catch(() => toast(toastErrorOptions("Failed to add sub category")));
  }

  const updateSubCategory = (subcategoryId: string) => (name: string, minCredits?: number, notes?: string) => {
    const elem: SubCategory = {
      id: subcategoryId,
      name,
      min_credits: minCredits,
      notes
    }

    update(elem)
      .then(() => toast(toastSuccessOptions("Successfully edited sub category")))
      .catch(() => toast(toastErrorOptions("Failed to edit sub category")));
  }

  const removeSubCategory = (subcategoryId: string) => () => {
    remove(subcategoryId)
      .then(() => toast(toastSuccessOptions("Successfully removed sub category")))
      .catch(() => toast(toastErrorOptions("Failed to remove sub category")));
  }

  return (
    <Stack spacing={1} w="100%">

      {(subcategories && subcategories.length === 0) && (
        <Text color="gray">No sub categories yet</Text>
      )}
      <Stack w="100%">
        {subcategories && subcategories.map(m => (
          <SubCategoriesListEntry
            subcategory={m}
            updateSubCategory={updateSubCategory(m.id)}
            removeSubCategory={removeSubCategory(m.id)}
            key={m.id}
          />

        ))}
      </Stack>


      <AddSubCategoryButton addSubCategory={addSubCategory}/>

    </Stack>
  )
}

export default SubCategoriesList;