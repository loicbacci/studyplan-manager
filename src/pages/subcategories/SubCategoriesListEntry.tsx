import React from "react";
import { Button, HStack, IconButton, Stack, Text, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import Entry from "../../components/Entry";
import DataModal from "../../components/DataModal";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface SubCategoriesListEntryBaseProps {
  subcategory?: SubCategory,
  addSubCategory?: (name: string, minCredits?: number, notes?: string) => void,
  updateSubCategory?: (name: string, minCredits?: number, notes?: string) => void,
  removeSubCategory?: () => void,

  upIndex?: () => void,
  downIndex?: () => void
}

const SubCategoriesListEntryBase = (props: SubCategoriesListEntryBaseProps) => {
  const { subcategory, addSubCategory, updateSubCategory, removeSubCategory, upIndex, downIndex } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const isEditing = subcategory !== undefined && updateSubCategory !== undefined && removeSubCategory !== undefined;
  const isAdding = addSubCategory !== undefined;


  const nameField: TextField = {
    name: "name",
    initialValue: subcategory ? subcategory.name : "",
    label: "Name",
    placeholder: "Enter name",
    validate: (v) => v === "" ? "Please enter name" : "",
    isRequired: true
  }


  const notesField: TextField = {
    name: "notes",
    initialValue: (subcategory && subcategory.notes) ? subcategory.notes : undefined,
    label: "Notes",
    placeholder: "Enter notes",
    undefinedType: "string",
    textArea: true
  }

  const minCreditsField: NumberField = {
    name: "min_credits",
    initialValue: (subcategory && subcategory.min_credits) ? subcategory.min_credits : undefined,
    label: "Minimum credits",
    placeholder: "Enter minimum credits",
    undefinedType: "number",
    minNumber: 0
  }

  const onSubmit = (elem: Omit<Category, "id">) => {

    if (isEditing) {
      // EDIT
      // Need to remove the undefined
      updateSubCategory(elem.name, elem.min_credits, elem.notes);
    } else if (isAdding) {
      // ADD
      addSubCategory(elem.name, elem.min_credits, elem.notes);
    }

    onClose();
  }

  const onDelete = () => {
    if (isEditing) {
      removeSubCategory();
    }

    onClose();
  }

  return (
    <>
      {isEditing ? (
        <Entry
          left={
            <Stack spacing={0}>
              <Text>{subcategory.name}</Text>
              {subcategory.notes && <Text color="gray">{subcategory.notes}</Text>}
              {(!isDesktop && subcategory.min_credits) && <Text color="gray">{subcategory.min_credits} min credits</Text>}
            </Stack>
          }
          right={
            <HStack>
              {(isDesktop && subcategory.min_credits) && <Text>{subcategory.min_credits} minimum credits</Text>}

              <Stack spacing={0}>
                {upIndex && (
                  <IconButton
                    aria-label="up-index"
                    size="sm"
                    h={downIndex ? "5" : undefined}
                    borderRadius={downIndex ? 0 : "md"}
                    borderTopLeftRadius="md"
                    borderTopRightRadius="md"
                    icon={<FiChevronUp/>}
                    onClick={upIndex}
                  />
                )}
                {downIndex && (
                  <IconButton
                    aria-label="up-index"
                    size="sm"
                    h={upIndex ? "5" : undefined}
                    borderRadius={upIndex ? 0 : "md"}
                    borderBottomLeftRadius="md"
                    borderBottomRightRadius="md"
                    icon={<FiChevronDown/>}
                    onClick={downIndex}
                  />
                )}
              </Stack>
            </HStack>
          }
          onEdit={onOpen}
          iconSize="sm"
        />
      ) : (
        <Button onClick={onOpen} w="fit-content" size="sm">
          Add sub category
        </Button>
      )}


      <DataModal
        headerTitle={<Text>{isEditing ? "Edit" : "Add"} Sub Category</Text>}
        alertTitle={<Text>Delete Sub Category</Text>}
        fields={[nameField, minCreditsField, notesField]}
        onSubmit={onSubmit}
        onDelete={isEditing ? onDelete : undefined}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>

  )
}

interface SubCategoriesListEntryProps {
  subcategory: SubCategory,
  updateSubCategory?: (name: string, minCredits?: number, notes?: string) => void,
  removeSubCategory?: () => void,

  upIndex?: () => void,
  downIndex?: () => void
}

export const SubCategoriesListEntry = (props: SubCategoriesListEntryProps) => {
  return (
    <SubCategoriesListEntryBase {...props}/>
  )
}

interface AddSubCategoryButtonProps {
  addSubCategory?: (name: string, minCredits?: number, notes?: string) => void,
}

export const AddSubCategoryButton = (props: AddSubCategoryButtonProps) => {
  return (
    <SubCategoriesListEntryBase {...props}/>
  )
}
