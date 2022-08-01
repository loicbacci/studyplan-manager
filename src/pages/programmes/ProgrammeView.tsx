import React from "react";
import { useParams } from "react-router-dom";
import { Divider, Grid, Heading, HStack, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { useProgramme } from "../../lib/firestore/programmes";
import MajorsList from "../majors/MajorsList";
import MinorsList from "../minors/MinorsList";
import CategoriesList from "../categories/CategoriesList";
import SeasonsList from "../seasons/SeasonsList";
import SemestersList from "../semesters/SemestersList";

const ProgrammeViewLoader = () => {
  const { programmeId } = useParams();

  if (!programmeId) {
    return <div/>
  }

  return <ProgrammeView programmeId={programmeId}/>
}

interface ProgrammePageProps {
  programmeId: string
}

const ProgrammeView = (props: ProgrammePageProps) => {
  const { programmeId } = props;
  const { programme } = useProgramme(programmeId);

  const isDesktop = useBreakpointValue({ base: false, lg: true });

  if (!programme) {
    return (
      <Text>Programme {programmeId} not found.</Text>
    )
  }

  return (
    <Stack spacing={4}>
      <Heading mb={2}>{programme.name}</Heading>

      {programme.notes && (
        <Text>{programme.notes}</Text>
      )}

      <CategoriesList programme={programme}/>

      <Divider />

      {isDesktop ? (
        <Stack>
          <HStack align="start">
            <MajorsList programmeId={programme.id}/>
            <MinorsList programmeId={programme.id}/>
          </HStack>
          <HStack align="start">
            <SeasonsList programmeId={programme.id}/>
            <SemestersList programmeId={programme.id}/>
          </HStack>
        </Stack>
      ) : (
        <Stack>
          <MajorsList programmeId={programme.id}/>
          <MinorsList programmeId={programme.id}/>
          <SeasonsList programmeId={programme.id}/>
          <SemestersList programmeId={programme.id}/>
        </Stack>
      )}

    </Stack>
  )
}


export default ProgrammeViewLoader;
