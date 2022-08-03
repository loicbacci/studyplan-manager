import React, { useEffect } from "react";
import {
  Flex,
  Heading,
  HStack, IconButton,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddCategoryButton, CategoriesListEntry } from "./CategoriesListEntry";
import { useCategories } from "../../lib/firestore/categories";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { sortByIndex } from "../../lib/utils";


interface CategoriesListProps {
  programme: Programme
}

const CategoriesList = (props: CategoriesListProps) => {
  const { programme } = props;
  const { categories, add, update, remove } = useCategories(programme.id);
  const toast = useToast();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle } = useDisclosure();

  const addCategory = (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => {
    if (!categories) return;

    const index = categories.length !== 0 ? Math.max(...categories.map(c => c.index)) + 1 : 0;

    const elem: Omit<Category, "id"> = {
      name,
      is_major: isMajor,
      is_minor: isMinor,
      min_credits: minCredits,
      notes,
      index
    }

    add(elem)
      .then(() => toast(toastSuccessOptions("Successfully added category")))
      .catch(() => toast(toastErrorOptions("Failed to add category")));
  }

  const updateCategory = (categoryId: string, index: number) => (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => {
    const elem: Category = {
      id: categoryId,
      name,
      is_major: isMajor,
      is_minor: isMinor,
      min_credits: minCredits,
      notes,
      index
    }

    console.log(minCredits)

    update(elem)
      .then(() => toast(toastSuccessOptions("Successfully edited category")))
      .catch(() => toast(toastErrorOptions("Failed to edit category")));
  }

  const removeCategory = (categoryId: string, index: number) => () => {
    remove(categoryId)
      .then(() => {
        toast(toastSuccessOptions("Successfully removed category"));

        if (categories) {
          categories.forEach(c => {
            if (c.index > index) c.index -= 1
          })
        }
      })
      .catch(() => toast(toastErrorOptions("Failed to remove category")));
  }

  const upIndex = (categoryIndex: number) => () => {
    if (!categories) return;

    const toMoveUp = categories.find(category => category.index === categoryIndex);
    const toMoveDown = categories.find(category => category.index === categoryIndex - 1);

    if (!toMoveUp || !toMoveDown) return;

    update({ ...toMoveUp, index: toMoveUp.index - 1 });
    update({ ...toMoveDown, index: toMoveDown.index + 1 });
  }

  const downIndex = (categoryIndex: number) => () => {
    if (!categories) return;

    const toMoveDown = categories.find(category => category.index === categoryIndex);
    const toMoveUp = categories.find(category => category.index === categoryIndex + 1);


    if (!toMoveUp || !toMoveDown) return;

    update({ ...toMoveUp, index: toMoveUp.index - 1 });
    update({ ...toMoveDown, index: toMoveDown.index + 1 });
  }

  const Body = (
    <>
      {(categories && categories.length === 0) && <Text color="gray">No categories yet</Text>}
      <Stack w="100%">
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


        {categories && categories.sort(sortByIndex).map(category => (
          <CategoriesListEntry
            category={category}
            programmeId={programme.id}
            updateCategory={updateCategory(category.id, category.index)}
            removeCategory={removeCategory(category.id, category.index)}
            key={category.id}
            upIndex={category.index != 0 ? upIndex(category.index) : undefined}
            downIndex={category.index != categories.length - 1 ? downIndex(category.index) : undefined}
          />

        ))}

        <AddCategoryButton addCategory={addCategory}/>
      </Stack>
    </>
  )

  return (
    <Stack
      borderWidth="1px"
      borderRadius="md"
      py={{ base: 1, lg: 2 }}
      pb={{ base: 1, lg: 2 }}
      px={{ base: 2, lg: 4 }}
      w="100%"
    >
      <HStack justify="space-between">
        <Heading size="md" mb={2}>
          Structure
        </Heading>

        <IconButton
          variant="ghost"
          aria-label="Open menu"
          icon={isOpen ? <FiChevronUp/> : <FiChevronDown fontSize="1.25rem"/>}
          onClick={onToggle}
        />
      </HStack>



      {isOpen && Body}
    </Stack>
  )
}

export default CategoriesList;