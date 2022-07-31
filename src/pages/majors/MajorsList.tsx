import React from "react";
import { useMajors } from "../../lib/firestore/majors";
import {
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddMajorButton, MajorsListEntry } from "./MajorsListEntry";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface MajorsListProps {
  programmeId: string
}

const MajorsList = (props: MajorsListProps) => {
  const { programmeId } = props;
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle } = useDisclosure();

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

  const Body = (
    <>
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
    </>
  )

  return (
    <Stack
      borderWidth="1px"
      borderRadius="md"
      py={{ base: 1, lg: 2 }}
      pb={2}
      px={4}
      w="100%"
    >
      <HStack justify="space-between">
        <Heading size="md" mb={{ base: 0, lg: 2 }}>
          Majors
        </Heading>

        {!isDesktop && (
          <IconButton
            variant="ghost"
            aria-label="Open menu"
            icon={isOpen ? <FiChevronUp/> : <FiChevronDown fontSize="1.25rem"/>}
            onClick={onToggle}
          />
        )}
      </HStack>

      {isDesktop ? Body : isOpen && Body}
    </Stack>
  )
}

export default MajorsList;