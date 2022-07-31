import React from "react";
import { useParams } from "react-router-dom";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { useProgramme } from "../../lib/firestore/programmes";

const ProgrammePageLoader = () => {
  const { programmeId } = useParams();

  if (!programmeId) {
    return <div/>
  }

  return <ProgrammePage programmeId={programmeId}/>
}

interface ProgrammePageProps {
  programmeId: string
}

const ProgrammePage = (props: ProgrammePageProps) => {
  const { programmeId } = props;
  const { programme } = useProgramme(programmeId);

  if (!programme) {
    return (
      <Text>Programme {programmeId} not found.</Text>
    )
  }

  return (
    <Stack>
      <Heading>{programme.name}</Heading>
    </Stack>
  )
}


export default ProgrammePageLoader;
