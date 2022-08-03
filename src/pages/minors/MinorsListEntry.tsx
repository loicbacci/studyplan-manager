import React from "react";
import { Button, Link, Text, useDisclosure } from "@chakra-ui/react";
import Entry from "../../components/Entry";
import { Link as RLink } from "react-router-dom";
import DataModal from "../../components/DataModal";

interface MinorsListEntryBaseProps {
  minor?: Minor,
  addMinor?: (name: string) => void,
  renameMinor?: (newName: string) => void,
  removeMinor?: () => void
}

const MinorsListEntryBase = (props: MinorsListEntryBaseProps) => {
  const { minor, addMinor, renameMinor, removeMinor } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEditing = minor !== undefined && renameMinor !== undefined && removeMinor !== undefined;
  const isAdding = addMinor !== undefined;

  const nameField: TextField = {
    name: "name",
    initialValue: minor ? minor.name : "",
    label: "Name",
    placeholder: "Enter name",
    validate: (v) => v === "" ? "Please enter name" : "",
    isRequired: true
  }

  const onSubmit = (elem: Omit<Minor, "id">) => {
    if (isEditing) {
      // EDIT
      renameMinor(elem.name);
    } else if (isAdding) {
      // ADD
      addMinor(elem.name);
    }

    onClose();
  }

  const onDelete = () => {
    if (isEditing) {
      removeMinor();
    }

    onClose();
  }

  return (
    <>
      {isEditing ? (
        <Entry
          left={<Text>{minor.name}</Text>}
          onClick={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="fit-content" size="sm">
          Add minor
        </Button>
      )}

      <DataModal
        headerTitle={<Text>{isEditing ? "Edit" : "Add"} Minor</Text>}
        alertTitle={<Text>Delete Minor</Text>}
        fields={[nameField]}
        onSubmit={onSubmit}
        onDelete={isEditing ? onDelete : undefined}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>

  )
}

interface MinorsListEntryProps {
  minor: Minor,
  renameMinor: (newName: string) => void,
  removeMinor: () => void
}

export const MinorsListEntry = (props: MinorsListEntryProps) => {
  const { minor, renameMinor, removeMinor } = props;

  return (
    <MinorsListEntryBase
      minor={minor}
      renameMinor={renameMinor}
      removeMinor={removeMinor}
    />
  )
}

interface AddMinorButtonProps {
  addMinor: (name: string) => void
}

export const AddMinorButton = (props: AddMinorButtonProps) => {
  const { addMinor } = props;

  return (
    <MinorsListEntryBase
      addMinor={addMinor}
    />
  )
}
