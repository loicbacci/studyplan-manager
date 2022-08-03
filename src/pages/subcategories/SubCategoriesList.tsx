import React from "react";
import { Heading, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddSubCategoryButton, SubCategoriesListEntry } from "./SubCategoriesListEntry";
import { useProgramme } from "../../lib/firestore/programmes";
import { useCategories } from "../../lib/firestore/categories";
import { useSubCategories } from "../../lib/firestore/subcategories";
import { FiCornerDownRight } from "react-icons/all";
import { sortByIndex } from "../../lib/utils";


interface SubCategoriesListProps {
  programmeId: string,
  categoryId: string
}

const SubCategoriesList = (props: SubCategoriesListProps) => {
  const { programmeId, categoryId } = props;

  const { subcategories, add, update, remove } = useSubCategories(programmeId, categoryId);
  const toast = useToast();


  const addSubCategory = (name: string, minCredits?: number, notes?: string) => {
    if (!subcategories) return;

    const index = subcategories.length !== 0 ? Math.max(...subcategories.map(s => s.index)) + 1 : 0;

    const elem: Omit<SubCategory, "id"> = {
      name,
      min_credits: minCredits,
      notes,
      index
    }

    add(elem)
      .then(() => toast(toastSuccessOptions("Successfully added sub category")))
      .catch(() => toast(toastErrorOptions("Failed to add sub category")));
  }

  const updateSubCategory = (subcategoryId: string, index: number) => (name: string, minCredits?: number, notes?: string) => {
    const elem: SubCategory = {
      id: subcategoryId,
      name,
      min_credits: minCredits,
      notes,
      index
    }

    update(elem)
      .then(() => toast(toastSuccessOptions("Successfully edited sub category")))
      .catch(() => toast(toastErrorOptions("Failed to edit sub category")));
  }

  const removeSubCategory = (subcategoryId: string, index: number) => () => {
    remove(subcategoryId)
      .then(() => {
        toast(toastSuccessOptions("Successfully removed sub category"))

        if (subcategories) {
          subcategories.forEach(s => {
            if (s.index > index) s.index -= 1
          })
        }
      })
      .catch(() => toast(toastErrorOptions("Failed to remove sub category")));
  }

  const upIndex = (subcategoryIndex: number) => () => {
    if (!subcategories) return;

    const toMoveUp = subcategories.find(subcategory => subcategory.index === subcategoryIndex);
    const toMoveDown = subcategories.find(subcategory => subcategory.index === subcategoryIndex - 1);

    if (!toMoveUp || !toMoveDown) return;

    update({ ...toMoveUp, index: toMoveUp.index - 1 });
    update({ ...toMoveDown, index: toMoveDown.index + 1 });
  }

  const downIndex = (subcategoryIndex: number) => () => {
    if (!subcategories) return;

    const toMoveDown = subcategories.find(subcategory => subcategory.index === subcategoryIndex);
    const toMoveUp = subcategories.find(subcategory => subcategory.index === subcategoryIndex + 1);


    if (!toMoveUp || !toMoveDown) return;

    update({ ...toMoveUp, index: toMoveUp.index - 1 });
    update({ ...toMoveDown, index: toMoveDown.index + 1 });
  }

  return (
    <Stack spacing={1} w="100%">

      {(subcategories && subcategories.length === 0) && (
        <Text color="gray">No sub categories yet</Text>
      )}
      <Stack w="100%">
        {subcategories && subcategories.sort(sortByIndex).map(subcat => (
          <SubCategoriesListEntry
            subcategory={subcat}
            updateSubCategory={updateSubCategory(subcat.id, subcat.index)}
            removeSubCategory={removeSubCategory(subcat.id, subcat.index)}
            key={subcat.id}
            upIndex={subcat.index != 0 ? upIndex(subcat.index) : undefined}
            downIndex={subcat.index != subcategories.length - 1 ? downIndex(subcat.index) : undefined}
          />

        ))}
      </Stack>


      <AddSubCategoryButton addSubCategory={addSubCategory}/>

    </Stack>
  )
}

export default SubCategoriesList;