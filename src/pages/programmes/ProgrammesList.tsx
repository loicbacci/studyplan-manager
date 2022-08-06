import React, { useEffect } from "react";
import { Alert, AlertIcon, AlertTitle, Center, Heading, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import { toastErrorOptions } from "../../lib/chakraUtils";
import { AddProgrammeButton, ProgrammesListEntry } from "./ProgrammesListEntry";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchProgrammes,
  selectProgrammes,
  selectProgrammesAddStatus,
  selectProgrammesDeleteStatus,
  selectProgrammesStatus,
  selectProgrammesUpdateStatus
} from "../../redux/programmesSlice";

const ProgrammesListLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack spacing={4}>
      <Heading mb={2}>Programmes</Heading>

      {children}

      <AddProgrammeButton/>
    </Stack>
  )
}

const ProgrammesList = () => {
  const toast = useToast();

  const status = useAppSelector(selectProgrammesStatus);
  const programmes = useAppSelector(selectProgrammes);

  const addStatus = useAppSelector(selectProgrammesAddStatus);
  const updateStatus = useAppSelector(selectProgrammesUpdateStatus);
  const deleteStatus = useAppSelector(selectProgrammesDeleteStatus);

  const dispatch = useAppDispatch();

  // Load programmes list if not yet loaded
  useEffect(() => {
    if (status === "unloaded") {
      dispatch(fetchProgrammes());
    }
  }, [status]);

  // Show toasts when errors when adding, updating or removing occur
  useEffect(() => {
    if (addStatus === "error") {
      toast(toastErrorOptions("Failed to add programme."))
    }
  }, [addStatus])

  useEffect(() => {
    if (updateStatus === "error") {
      toast(toastErrorOptions("Failed to update programme."))
    }
  }, [updateStatus]);

  useEffect(() => {
    if (deleteStatus === "error") {
      toast(toastErrorOptions("Failed to delete programme."))
    }
  }, [deleteStatus]);

  if (status === "loading") {
    return (
      <ProgrammesListLayout>
        <Center>
          <Spinner/>
        </Center>
      </ProgrammesListLayout>
    )
  }

  if (status === "error") {
    return (
      <ProgrammesListLayout>
        <Alert status="error">
          <AlertIcon/>
          <AlertTitle>Failed to load programmes.</AlertTitle>
        </Alert>
      </ProgrammesListLayout>
    )
  }

  return (
    <Stack spacing={4}>
      <Heading mb={2}>Programmes</Heading>

      {programmes.length === 0 ? (
        <Text color="gray">No programmes yet</Text>
      ) : (
        <Stack>
          {programmes.map(p => (
            <ProgrammesListEntry programme={p} key={p.id}/>
          ))}
        </Stack>
      )}

      <AddProgrammeButton/>
    </Stack>
  )
}

export default ProgrammesList;
