import React from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { useProgrammes } from "../../lib/firestore/programmes";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import ProgrammesListEntry from "./ProgrammesListEntry";
import AddProgrammeButton from "./AddProgrammeButton";

const ProgrammesList = () => {
  const { programmes, add, update, remove } = useProgrammes();
  const toast = useToast();


  const addProgramme = (name: string) => {
    add({ name })
      .then(() => toast(toastSuccessOptions("Successfully added programme")))
      .catch(() => toast(toastErrorOptions("Failed to add programme")));
  }

  const renameProgramme = (programmeId: string) => (newName: string) => {
    update({ id: programmeId, name: newName })
      .then(() => toast(toastSuccessOptions("Successfully edited programme")))
      .catch(() => toast(toastErrorOptions("Failed to edit programme")));
  }

  const removeProgramme = (programmeId: string) => () => {
    remove(programmeId)
      .then(() => toast(toastSuccessOptions("Successfully removed programme")))
      .catch(() => toast(toastErrorOptions("Failed to remove programme")));
  }

  return (
    <Stack>
      {programmes && programmes.map(p => (
        <ProgrammesListEntry
          programme={p}
          renameProgramme={renameProgramme(p.id)}
          removeProgramme={removeProgramme(p.id)}
          key={p.id}
        />
      ))}

      <AddProgrammeButton addProgramme={addProgramme} />
    </Stack>
  )
}

export default ProgrammesList;
