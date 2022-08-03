import React from "react";
import { Button, Text, useDisclosure } from "@chakra-ui/react";
import Entry from "../../components/Entry";
import DataModal from "../../components/DataModal";

interface MajorsListEntryBaseProps {
  major?: Major,
  addMajor?: (name: string) => void,
  renameMajor?: (newName: string) => void,
  removeMajor?: () => void
}

const MajorsListEntryBase = (props: MajorsListEntryBaseProps) => {
  const {  major, addMajor, renameMajor, removeMajor } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEditing = major !== undefined && renameMajor !== undefined && removeMajor !== undefined;
  const isAdding = addMajor !== undefined;

  const nameField: TextField = {
    name: "name",
    initialValue: major ? major.name : "",
    label: "Name",
    placeholder: "Enter name",
    validate: (v) => v === "" ? "Please enter name" : "",
    isRequired: true
  }

  const onSubmit = (elem: Omit<Major, "id">) => {
    if (isEditing) {
      // EDIT
      renameMajor(elem.name);
    } else if (isAdding) {
      // ADD
      addMajor(elem.name);
    }

    onClose();
  }

  const onDelete = () => {
    if (isEditing) {
      removeMajor();
    }

    onClose();
  }

  return (
    <>
      {isEditing ? (
        <Entry
          left={<Text>{major.name}</Text>}
          onClick={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="fit-content" size="sm">
          Add major
        </Button>
      )}

      <DataModal
        headerTitle={<Text>{isEditing ? "Edit" : "Add"} Major</Text>}
        alertTitle={<Text>Delete Major</Text>}
        fields={[nameField]}
        onSubmit={onSubmit}
        onDelete={isEditing ? onDelete : undefined}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>

  )
}

interface MajorsListEntryProps {
  major: Major,
  renameMajor: (newName: string) => void,
  removeMajor: () => void
}

export const MajorsListEntry = (props: MajorsListEntryProps) => {
  const { major, renameMajor, removeMajor } = props;

  return (
    <MajorsListEntryBase
      major={major}
      renameMajor={renameMajor}
      removeMajor={removeMajor}
    />
  )
}

interface AddMajorButtonProps {
  addMajor: (name: string) => void
}

export const AddMajorButton = (props: AddMajorButtonProps) => {
  const { addMajor } = props;

  return (
    <MajorsListEntryBase
      addMajor={addMajor}
    />
  )
}
