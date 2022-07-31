import React from "react";
import { Flex, Heading, HStack, Spacer, Stack, Text, useBreakpointValue, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddCategoryButton, CategoriesListEntry } from "./CategoriesListEntry";
import { useCategories } from "../../lib/firestore/categories";


interface CategoriesListProps {
  programme: Programme
}

const CategoriesList = (props: CategoriesListProps) => {
  const { programme } = props;
  const { categories, add, update, remove } = useCategories(programme.id);
  const toast = useToast();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

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

    console.log(minCredits)

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
      w="100%"
    >
      <Heading size="md" mb={2}>
        Structure
      </Heading>


      {(categories && categories.length === 0) && <Text color="gray">No categories yet</Text>}
      <Stack w="100%" borderWidth="1px" borderRadius="md" py={2} px={2} >
        {isDesktop ? (
          <HStack justify="space-between">
            <Heading size="sm">{programme.name}</Heading>
            <Text>{programme.min_credits} minimum credits</Text>
          </HStack>
        ) : (
          <Stack>
            <Heading size="sm">{programme.name}</Heading>
            <Text>{programme.min_credits} minimum credits</Text>
          </Stack>
        )}


        {categories && categories.map(category => (
          <CategoriesListEntry
            category={category}
            programmeId={programme.id}
            updateCategory={updateCategory(category.id)}
            removeCategory={removeCategory(category.id)}
            key={category.id}
          />

        ))}

        <AddCategoryButton addCategory={addCategory}/>
      </Stack>


    </Stack>
  )
}

export default CategoriesList;