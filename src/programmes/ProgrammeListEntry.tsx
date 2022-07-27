import React from "react";
import MetadataModal from "../metadata/MetadataModal";
import {Button, Heading, Link, Text, useDisclosure, useToast} from "@chakra-ui/react";
import MetadataEntry from "../metadata/MetadataEntry";
import {addProgramme, deleteProgramme, updateProgramme} from "../firebase/programme/programme";
import {toastErrorOptions, toastSuccessOptions} from "../utils";
import {Link as RLink} from "react-router-dom";

interface ProgrammeEntryProps {
  programme?: ProgrammeStructure
}

const ProgrammeListEntry = (props: ProgrammeEntryProps) => {
  const { programme } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const nameField: TextField = {
    name: "name",
    initialValue: programme ? programme.name : "",
    label: "Name",
    placeholder: "Enter name",
    validate: (v) => v === "" ? "Please enter name" : "",
    isRequired: true
  }

  const onSubmit = (elem: Omit<ProgrammeStructure, "id">) => {
    if (programme) {
      // EDIT
      updateProgramme(programme.id, elem.name)
        .then(() => toast(toastSuccessOptions("Successfully edited programme")))
        .catch(() => toast(toastErrorOptions("Failed to edit programme")));
    } else {
      // ADD
      addProgramme(elem.name)
        .then(() => toast(toastSuccessOptions("Successfully added programme")))
        .catch(() => toast(toastErrorOptions("Failed to add programme")));
    }

    onClose();
  }

  const onDelete = () => {
    if (programme) {
      deleteProgramme(programme.id)
        .then(() => toast(toastSuccessOptions("Successfully deleted programme")))
        .catch(() => toast(toastErrorOptions("Failed to delete programme")));
    }

    onClose();
  }

  return (
    <>
      {programme ? (
        <MetadataEntry
          left={
            <Link as={RLink} to={`/programmes/${programme.id}`}>
              {programme.name}
            </Link>
          }
          onEdit={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="40">
          Add programme
        </Button>
      )}

      <MetadataModal
        headerTitle={<Text>{programme ? "Edit" : "Add"} Programme</Text>}
        fields={[nameField]}
        onSubmit={onSubmit}
        onDelete={programme && onDelete}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>

  )
}

export default ProgrammeListEntry;
