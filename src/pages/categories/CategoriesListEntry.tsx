import React from "react";
import { Button, Link, Text, useDisclosure } from "@chakra-ui/react";
import Entry from "../../components/Entry";
import { Link as RLink } from "react-router-dom";
import DataModal from "../../components/DataModal";

interface CategoriesListEntryBaseProps {
  category?: Category,
  addCategory?: (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => void,
  updateCategory?: (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => void,
  removeCategory?: () => void
}

const CategoriesListEntryBase = (props: CategoriesListEntryBaseProps) => {
  const { category, addCategory, updateCategory, removeCategory } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEditing = category !== undefined && updateCategory !== undefined && removeCategory !== undefined;
  const isAdding = addCategory !== undefined;

  const getMajorMinorInitialValue = () => {
    if (!category) return "None";

    if (category.is_major) return "Major";
    if (category.is_minor) return "Minor";

    return "None";
  }

  const nameField: TextField = {
    name: "name",
    initialValue: category ? category.name : "",
    label: "Name",
    placeholder: "Enter name",
    validate: (v) => v === "" ? "Please enter name" : "",
    isRequired: true
  }

  const isMajorMinorField: RadioField = {
    name: "majorMinor",
    initialValue: getMajorMinorInitialValue(),
    label: "Is the category for a major, a minor or neither?",
    placeholder: "",
    possibleValues: ["Major", "Minor", "None"],
    isRequired: true,
    isRadio: true
  }

  const notesField: TextField = {
    name: "notes",
    initialValue: (category && category.notes) ? category.notes : undefined,
    label: "Notes",
    placeholder: "Enter notes",
    undefinedType: "string",
    textArea: true
  }

  const minCreditsField: NumberField = {
    name: "minCredits",
    initialValue: (category && category.min_credits) ? category.min_credits : undefined,
    label: "Minimum credits",
    placeholder: "Enter minimum credits",
    undefinedType: "number",
    minNumber: 0
  }

  const onSubmit = (elem: Omit<Category, "id">) => {
    if (isEditing) {
      // EDIT
      // Need to remove the undefined
      updateCategory(elem.name, elem.is_major, elem.is_minor, elem.min_credits, elem.notes);
    } else if (isAdding) {
      // ADD
      addCategory(elem.name, elem.is_major, elem.is_minor, elem.min_credits, elem.notes);
    }

    onClose();
  }

  const onDelete = () => {
    if (isEditing) {
      removeCategory();
    }

    onClose();
  }

  return (
    <>
      {isEditing ? (
        <Entry
          left={<Text>{category.name} </Text>}
          onEdit={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="fit-content" size="sm">
          Add category
        </Button>
      )}

      <DataModal
        headerTitle={<Text>{isEditing ? "Edit" : "Add"} Category</Text>}
        alertTitle={<Text>Delete Category</Text>}
        fields={[nameField, isMajorMinorField, minCreditsField, notesField]}
        onSubmit={onSubmit}
        onDelete={isEditing ? onDelete : undefined}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>

  )
}

interface CategoriesListEntryProps {
  category: Category,
  updateCategory?: (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => void,
  removeCategory?: () => void
}

export const CategoriesListEntry = (props: CategoriesListEntryProps) => {
  const {  category, updateCategory, removeCategory } = props;

  return (
    <CategoriesListEntryBase
      category={category}
      updateCategory={updateCategory}
      removeCategory={removeCategory}
    />
  )
}

interface AddCategoryButtonProps {
  addCategory?: (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => void,
}

export const AddMajorButton = (props: AddCategoryButtonProps) => {
  const { addCategory } = props;

  return (
    <CategoriesListEntryBase
      addCategory={addCategory}
    />
  )
}
