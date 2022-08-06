import React from "react";
import DataModal from "../../components/DataModal";
import { Button, Link, Stack, Text, useDisclosure } from "@chakra-ui/react";
import Entry from "../../components/Entry";
import { Link as RLink } from "react-router-dom";
import { addProgramme, deleteProgramme, updateProgramme } from "../../redux/programmesSlice";
import { useAppDispatch } from "../../redux/hooks";

interface ProgrammesEntryBaseProps {
  programme?: Programme
}

const ProgrammesListEntryBase = (props: ProgrammesEntryBaseProps) => {
  const { programme } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useAppDispatch();

  const editing = programme !== undefined;

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
  const notesField: TextField = {
    name: "notes",
    initialValue: (programme && programme.notes) ? programme.notes : undefined,
    label: "Notes",
    placeholder: "Enter notes",
    undefinedType: "string",
    textArea: true
  }

  const onSubmit = (elem: Omit<Programme, "id">) => {
    if (editing) {
      dispatch(updateProgramme({ id: programme.id, ...elem }))
    } else {
      dispatch(addProgramme(elem));
    }

    onClose();
  }

  const onDelete = () => {
    if (editing) {
      dispatch(deleteProgramme(programme.id));
    }

    onClose();
  }

  return (
    <>
      {editing ? (
        <Entry
          left={
            <Stack spacing={0}>
              <Link as={RLink} to={`/programmes/${programme.id}`}>
                {programme.name}
              </Link>
              {programme.notes && <Text color="gray">{programme.notes}</Text>}
            </Stack>
          }
          onClick={onOpen}
          border
        />

      ) : (
        <Button onClick={onOpen} w="40">
          Add programme
        </Button>
      )}

      <DataModal
        headerTitle={<Text>{editing ? "Edit" : "Add"} Programme</Text>}
        alertTitle={<Text>Delete Programme</Text>}
        fields={[nameField, minCreditsField, notesField]}
        onSubmit={onSubmit}
        onDelete={editing ? onDelete : undefined}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>

  )
}

interface ProgrammesListEntryProps {
  programme: Programme
}

export const ProgrammesListEntry = ({ programme }: ProgrammesListEntryProps) => {
  return (
    <ProgrammesListEntryBase programme={programme} />
  )
}


export const AddProgrammeButton = () => {
  return (
    <ProgrammesListEntryBase />
  )
}
