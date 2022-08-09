import React, { useEffect } from "react";
import { useMajors } from "../../lib/firestore/majors";
import {
  Alert,
  AlertIcon, AlertTitle,
  Center,
  Heading,
  HStack,
  IconButton, Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddMajorButton, MajorsListEntry } from "./MajorsListEntry";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchMajors, selectMajors, selectMajorsStatus } from "../../redux/selectedProgrammeSlice";

const MajorsLayout = ({ children }: { children?: React.ReactNode }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack
      borderWidth="1px"
      borderRadius="md"
      py={{ base: 1, lg: 2 }}
      pb={{ base: 1, lg: 2 }}
      px={{ base: 2, lg: 4 }}
      w="100%"
    >
      <HStack justify="space-between">
        <Heading size="md" mb={{ base: 0, lg: 2 }}>
          Majors
        </Heading>

        <IconButton
          variant="ghost"
          aria-label="Open menu"
          icon={isOpen ? <FiChevronUp/> : <FiChevronDown fontSize="1.25rem"/>}
          onClick={onToggle}
        />
      </HStack>

      {isOpen && children}
    </Stack>
  )
}

const MajorsList = () => {
  const dispatch = useAppDispatch();
  const majors = useAppSelector(selectMajors);
  const status = useAppSelector(selectMajorsStatus);

  const toast = useToast();

  useEffect(() => {
    if (status === "not loaded"){
      dispatch(fetchMajors());
    }
  }, [status])


  const addMajor = (name: string) => {
    /*add({ name })
      .then(() => toast(toastSuccessOptions("Successfully added major")))
      .catch(() => toast(toastErrorOptions("Failed to add major")));*/
  }

  const renameMajor = (majorId: string) => (newName: string) => {
    /*update({ id: majorId, name: newName })
      .then(() => toast(toastSuccessOptions("Successfully edited major")))
      .catch(() => toast(toastErrorOptions("Failed to edit major")));*/
  }

  const removeMajor = (majorId: string) => () => {
    /*remove(majorId)
      .then(() => toast(toastSuccessOptions("Successfully removed major")))
      .catch(() => toast(toastErrorOptions("Failed to remove major")));*/
  }

  let Body: JSX.Element

  if (status === "loading" || status === "not loaded") {
    Body = (
      <Center>
        <Spinner />
      </Center>
    )
  } else if (status === "error") {
    Body = (
      <Alert status="error">
        <AlertIcon/>
        <AlertTitle>Failed to load majors.</AlertTitle>
      </Alert>
    )
  } else if (majors.length === 0) {
    Body = (
      <Text color="gray">No majors yet</Text>
    )
  } else {
    Body = (
      <>
        <Stack>
          {majors.map(m => (
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
  }

  return (
    <MajorsLayout>
      {Body}
    </MajorsLayout>
  )
}

export default MajorsList;