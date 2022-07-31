import React from "react";
import { Button, Stack, Text, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import Entry from "../../components/Entry";
import DataModal from "../../components/DataModal";

interface SubCategoriesListEntryBaseProps {
  subcategory?: SubCategory,
  addSubCategory?: (name: string, minCredits?: number, notes?: string) => void,
  updateSubCategory?: (name: string, minCredits?: number, notes?: string) => void,
  removeSubCategory?: () => void
}

const SubCategoriesListEntryBase = (props: SubCategoriesListEntryBaseProps) => {
  const { subcategory, addSubCategory, updateSubCategory, removeSubCategory } = props;
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
              {(!isDesktop && subcategory.min_credits) && <Text>{subcategory.min_credits} minimum credits</Text>}
            </Stack>
          }
          right={(isDesktop && subcategory.min_credits) && <Text>{subcategory.min_credits} minimum credits</Text>}
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
  removeSubCategory?: () => void
}

export const SubCategoriesListEntry = (props: SubCategoriesListEntryProps) => {
  const { subcategory, updateSubCategory, removeSubCategory } = props;

  return (
    <SubCategoriesListEntryBase
      subcategory={subcategory}
      updateSubCategory={updateSubCategory}
      removeSubCategory={removeSubCategory}
    />
  )
}

interface AddSubCategoryButtonProps {
  addSubCategory?: (name: string, minCredits?: number, notes?: string) => void,
}

export const AddSubCategoryButton = (props: AddSubCategoryButtonProps) => {
  const { addSubCategory } = props;

  return (
    <SubCategoriesListEntryBase
      addSubCategory={addSubCategory}
    />
  )
}
