import React from "react";
import DataModal from "../../components/DataModal";
import { Box, Button, Link, Text, useDisclosure } from "@chakra-ui/react";
import Entry from "../../components/Entry";
import { Link as RLink } from "react-router-dom";

interface ProgrammesEntryBaseProps {
  programme?: Programme,
  addProgramme?: (name: string, minCredits: number) => void,
  updateProgramme?: (name: string, minCredits: number) => void,
  removeProgramme?: () => void
}

const ProgrammesListEntryBase = (props: ProgrammesEntryBaseProps) => {
  const { programme, addProgramme, updateProgramme, removeProgramme } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEditing = programme !== undefined && updateProgramme !== undefined && removeProgramme !== undefined;
  const isAdding = addProgramme !== undefined;

  const nameField: TextField = {
    name: "name",
    initialValue: programme ? programme.name : "",
    label: "Name",
    placeholder: "Enter name",
    validate: (v) => v === "" ? "Please enter name" : "",
    isRequired: true
  }

  const minCreditsField: NumberField = {
    name: "min_credits",
    initialValue: programme ? programme.min_credits : 0,
    label: "Minimum credits",
    placeholder: "Enter minimum credits",
    undefinedType: "number",
    minNumber: 0,
    validate: (v) => v > 0 ? "" : "Please enter minimum credits",
    isRequired: true
  }

  const onSubmit = (elem: Omit<Programme, "id">) => {
    if (isEditing) {
      // EDIT
      updateProgramme(elem.name, elem.min_credits);

    } else if (isAdding) {
      // ADD
      addProgramme(elem.name, elem.min_credits);
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
        fields={[nameField, minCreditsField]}
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
  updateProgramme: (name: string, minCredits: number) => void,
  removeProgramme: () => void,
}

export const ProgrammesListEntry = (props: ProgrammesListEntryProps) => {
  const { programme, updateProgramme, removeProgramme } = props;
  return (
    <ProgrammesListEntryBase
      programme={programme}
      updateProgramme={updateProgramme}
      removeProgramme={removeProgramme}
    />
  )
}

interface AddProgrammeButtonProps {
  addProgramme: (name: string, minCredits: number) => void,
}

export const AddProgrammeButton = (props: AddProgrammeButtonProps) => {
  const { addProgramme } = props;
  return (
    <ProgrammesListEntryBase
      addProgramme={addProgramme}
    />
  )
}
