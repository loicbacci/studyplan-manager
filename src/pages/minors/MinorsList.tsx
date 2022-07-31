import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading, Link, Stack, Text, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { Link as RLink, useParams } from "react-router-dom";
import { useProgramme } from "../../lib/firestore/programmes";
import { useMinors } from "../../lib/firestore/minors";
import { AddMinorButton, MinorsListEntry } from "./MinorsListEntry";


interface MinorsListProps {
  programmeId: string
}

const MinorsList = (props: MinorsListProps) => {
  const { programmeId } = props;

  const { minors, add, update, remove } = useMinors(programmeId);
  const toast = useToast();


  const addMinor = (name: string) => {
    add({ name })
      .then(() => toast(toastSuccessOptions("Successfully added minor")))
      .catch(() => toast(toastErrorOptions("Failed to add minor")));
  }

  const renameMinor = (minorId: string) => (newName: string) => {
    update({ id: minorId, name: newName })
      .then(() => toast(toastSuccessOptions("Successfully edited minor")))
      .catch(() => toast(toastErrorOptions("Failed to edit minor")));
  }

  const removeMinor = (minorId: string) => () => {
    remove(minorId)
      .then(() => toast(toastSuccessOptions("Successfully removed minor")))
      .catch(() => toast(toastErrorOptions("Failed to remove minor")));
  }

  return (
    <Stack
      borderWidth="1px"
      borderRadius="md"
      py={2}
      px={4}
      w="100%"
    >
      <Heading size= "md" mb={2}>
        Minors
      </Heading>


      {(minors && minors.length === 0) && <Text color="gray">No minors yet</Text>}
      <Stack>
        {minors && minors.map(m => (
          <MinorsListEntry
            minor={m}
            renameMinor={renameMinor(m.id)}
            removeMinor={removeMinor(m.id)}
            key={m.id}
          />
        ))}
      </Stack>


      <AddMinorButton addMinor={addMinor} />
    </Stack>
  )
}

export default MinorsList;