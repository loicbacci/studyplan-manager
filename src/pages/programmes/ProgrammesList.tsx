import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading, Stack, useToast, Text } from "@chakra-ui/react";
import { useProgrammes } from "../../lib/firestore/programmes";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddProgrammeButton, ProgrammesListEntry } from "./ProgrammesListEntry";

const ProgrammesList = () => {
  const { programmes, add, update, remove } = useProgrammes();
  const toast = useToast();


  const addProgramme = (name: string) => {
    add({ name })
      .then(() => toast(toastSuccessOptions("Successfully added programmeView")))
      .catch(() => toast(toastErrorOptions("Failed to add programmeView")));
  }

  const renameProgramme = (programmeId: string) => (newName: string) => {
    update({ id: programmeId, name: newName })
      .then(() => toast(toastSuccessOptions("Successfully edited programmeView")))
      .catch(() => toast(toastErrorOptions("Failed to edit programmeView")));
  }

  const removeProgramme = (programmeId: string) => () => {
    remove(programmeId)
      .then(() => toast(toastSuccessOptions("Successfully removed programmeView")))
      .catch(() => toast(toastErrorOptions("Failed to remove programmeView")));
  }

  return (
    <Stack spacing={4}>
      <Heading mb={2}>Programmes</Heading>

      <Stack>
        {(programmes && programmes.length === 0) && <Text color="gray">No programmes yet</Text>}
        {programmes && programmes.map(p => (
          <ProgrammesListEntry
            programme={p}
            renameProgramme={renameProgramme(p.id)}
            removeProgramme={removeProgramme(p.id)}
            key={p.id}
          />
        ))}
      </Stack>


      <AddProgrammeButton addProgramme={addProgramme} />
    </Stack>
  )
}

export default ProgrammesList;
