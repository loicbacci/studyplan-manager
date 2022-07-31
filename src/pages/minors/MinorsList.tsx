import React from "react";
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
import { useMinors } from "../../lib/firestore/minors";
import { AddMinorButton, MinorsListEntry } from "./MinorsListEntry";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";


interface MinorsListProps {
  programmeId: string
}

const MinorsList = (props: MinorsListProps) => {
  const { programmeId } = props;
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle } = useDisclosure();

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

  const Body = (
    <>
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

      <AddMinorButton addMinor={addMinor}/>
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
          Minors
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

export default MinorsList;