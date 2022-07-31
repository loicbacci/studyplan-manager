import React from "react";
import { Heading, Stack, Text, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddMajorButton, CategoriesListEntry } from "./CategoriesListEntry";
import { useProgramme } from "../../lib/firestore/programmes";
import { useCategories } from "../../lib/firestore/categories";


interface CategoriesListProps {
  programmeId: string
}

const CategoriesList = (props: CategoriesListProps) => {
  const { programmeId } = props;

  const { categories, add, update, remove } = useCategories(programmeId);
  const toast = useToast();


  const addCategory = (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => {
    const elem: Omit<Category, "id"> = {
      name,
      is_major: isMajor,
      is_minor: isMinor,
      min_credits: minCredits,
      notes
    }

    add(elem)
      .then(() => toast(toastSuccessOptions("Successfully added category")))
      .catch(() => toast(toastErrorOptions("Failed to add category")));
  }

  const updateCategory = (categoryId: string) => (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => {
    const elem: Category = {
      id: categoryId,
      name,
      is_major: isMajor,
      is_minor: isMinor,
      min_credits: minCredits,
      notes
    }

    update(elem)
      .then(() => toast(toastSuccessOptions("Successfully edited category")))
      .catch(() => toast(toastErrorOptions("Failed to edit category")));
  }

  const removeCategory = (categoryId: string) => () => {
    remove(categoryId)
      .then(() => toast(toastSuccessOptions("Successfully removed category")))
      .catch(() => toast(toastErrorOptions("Failed to remove category")));
  }

  return (
    <Stack
      borderWidth="1px"
      borderRadius="md"
      py={2}
      px={4}
      w="100%"
    >
      <Heading size="md" mb={2}>
        Categories
      </Heading>


      {(categories && categories.length === 0) && <Text color="gray">No categories yet</Text>}
      <Stack>
        {categories && categories.map(m => (
          <CategoriesListEntry
            category={m}
            updateCategory={updateCategory(m.id)}
            removeCategory={removeCategory(m.id)}
            key={m.id}
          />
        ))}
      </Stack>


      <AddMajorButton addCategory={addCategory}/>
    </Stack>
  )
}

export default CategoriesList;