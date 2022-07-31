import React from "react";
import { useMajors } from "../../lib/firestore/majors";
import { Heading, Stack, Text, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddMajorButton, MajorsListEntry } from "./MajorsListEntry";
import { useParams } from "react-router-dom";

interface MajorsListProps {
  programmeId: string
}

const MajorsList = (props: MajorsListProps) => {
  const { programmeId } = props;

  const { majors, add, update, remove } = useMajors(programmeId);
  const toast = useToast();


  const addMajor = (name: string) => {
    add({ name })
      .then(() => toast(toastSuccessOptions("Successfully added major")))
      .catch(() => toast(toastErrorOptions("Failed to add major")));
  }

  const renameMajor = (majorId: string) => (newName: string) => {
    update({ id: majorId, name: newName })
      .then(() => toast(toastSuccessOptions("Successfully edited major")))
      .catch(() => toast(toastErrorOptions("Failed to edit major")));
  }

  const removeMajor = (majorId: string) => () => {
    remove(majorId)
      .then(() => toast(toastSuccessOptions("Successfully removed major")))
      .catch(() => toast(toastErrorOptions("Failed to remove major")));
  }

  return (
    <Stack
      borderWidth="1px"
      borderRadius="md"
      py={2}
      px={4}
      w="100%"
    >
      <Heading size="md" mb={2}>
        Majors
      </Heading>


      {(majors && majors.length === 0) && <Text color="gray">No majors yet</Text>}
      <Stack>
        {majors && majors.map(m => (
          <MajorsListEntry
            major={m}
            renameMajor={renameMajor(m.id)}
            removeMajor={removeMajor(m.id)}
            key={m.id}
          />
        ))}
      </Stack>


      <AddMajorButton addMajor={addMajor}/>
    </Stack>
  )
}

export default MajorsList;