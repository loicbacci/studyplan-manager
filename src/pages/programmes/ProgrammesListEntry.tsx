import React from "react";
import DataModal from "../../components/DataModal";
import { Box, Button, Link, Text, useDisclosure } from "@chakra-ui/react";
import Entry from "../../components/Entry";
import { Link as RLink } from "react-router-dom";

interface ProgrammesEntryBaseProps {
  programme?: Programme,
  addProgramme?: (name: string) => void,
  renameProgramme?: (newName: string) => void,
  removeProgramme?: () => void
}

const ProgrammesListEntryBase = (props: ProgrammesEntryBaseProps) => {
  const { programme, addProgramme, renameProgramme, removeProgramme } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEditing = programme !== undefined && renameProgramme !== undefined && removeProgramme !== undefined;
  const isAdding = addProgramme !== undefined;

  const nameField: TextField = {
    name: "name",
    initialValue: programme ? programme.name : "",
    label: "Name",
    placeholder: "Enter name",
    validate: (v) => v === "" ? "Please enter name" : "",
    isRequired: true
  }

  const onSubmit = (elem: Omit<Programme, "id">) => {
    if (isEditing) {
      // EDIT
      renameProgramme(elem.name);

    } else if (isAdding) {
      // ADD
      addProgramme(elem.name);
    }

    onClose();
  }

  const onDelete = () => {
    if (isEditing) {
      removeProgramme();
    }

    onClose();
  }

  return (
    <>
      {isEditing ? (
        <Entry
          left={
            <Link as={RLink} to={`/programmes/${programme.id}`}>
              {programme.name}
            </Link>
          }
          onEdit={onOpen}
          border
        />

      ) : (
        <Button onClick={onOpen} w="40">
          Add programme
        </Button>
      )}

      <DataModal
        headerTitle={<Text>{isEditing ? "Edit" : "Add"} Programme</Text>}
        alertTitle={<Text>Delete Programme</Text>}
        fields={[nameField]}
        onSubmit={onSubmit}
        onDelete={isEditing ? onDelete : undefined}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>

  )
}

interface ProgrammesListEntryProps {
  programme: Programme,
  renameProgramme: (newName: string) => void,
  removeProgramme: () => void,
}

export const ProgrammesListEntry = (props: ProgrammesListEntryProps) => {
  const { programme, renameProgramme, removeProgramme } = props;
  return (
    <ProgrammesListEntryBase
      programme={programme}
      renameProgramme={renameProgramme}
      removeProgramme={removeProgramme}
    />
  )
}

interface AddProgrammeButtonProps {
  addProgramme: (name: string) => void,
}

export const AddProgrammeButton = (props: AddProgrammeButtonProps) => {
  const { addProgramme } = props;
  return (
    <ProgrammesListEntryBase
      addProgramme={addProgramme}
    />
  )
}
