import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  AlertIcon, AlertTitle,
  Center,
  Divider,
  Grid,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";
import { useProgramme } from "../../lib/firestore/programmes";
import MajorsList from "../majors/MajorsList";
import MinorsList from "../minors/MinorsList";
import CategoriesList from "../categories/CategoriesList";
import SeasonsList from "../seasons/SeasonsList";
import SemestersList from "../semesters/SemestersList";
import CoursesList from "../courses/CoursesList";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectProgramme,
  selectSelectedProgramme,
  selectSelectedProgrammesStatus
} from "../../redux/selectedProgrammeSlice";

const ProgrammeView = () => {
  const { programmeId } = useParams();

  const dispatch = useAppDispatch();
  const programme = useAppSelector(selectSelectedProgramme);
  const status = useAppSelector(selectSelectedProgrammesStatus);

  const isDesktop = useBreakpointValue({ base: false, lg: true });

  useEffect(() => {
    if (!programmeId) return;
    dispatch(selectProgramme(programmeId));
  }, [programmeId])

  if (status === "not selected" || status === "loading") {
    return (
      <Center>
        <Spinner />
      </Center>
    )
  }

  if (status === "error" || !programme) {
    return (
      <Alert status="error">
        <AlertIcon/>
        <AlertTitle>Failed to load programme.</AlertTitle>
      </Alert>
    )
  }

  if (!programmeId) {
    return <div/>
  }

  return (
    <Stack spacing={4}>
      <Heading mb={2}>{programme.name}</Heading>

      {programme.notes && (
        <Text>{programme.notes}</Text>
      )}

      <Stack spacing={4} divider={<Divider />}>
        <CoursesList programmeId={programme.id} />

        <CategoriesList programme={programme}/>

        {isDesktop ? (
          <Stack>
            <HStack align="start">
              <MajorsList />
              <MinorsList programmeId={programme.id}/>
            </HStack>
            <HStack align="start">
              <SeasonsList programmeId={programme.id}/>
              <SemestersList programmeId={programme.id}/>
            </HStack>
          </Stack>
        ) : (
          <Stack>
            <MajorsList />
            <MinorsList programmeId={programme.id}/>
            <SeasonsList programmeId={programme.id}/>
            <SemestersList programmeId={programme.id}/>
          </Stack>
        )}
      </Stack>


    </Stack>
  )
}

export default ProgrammeView;
