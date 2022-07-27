import React from "react";
import {useParams} from "react-router-dom";
import {Heading, Stack, Text} from "@chakra-ui/react";
import {useProgramme} from "../firebase/database";

const ProgrammeView = () => {
  const { programmeId } = useParams();

  if (!programmeId) {
    return <div />
  }

  return programmeId ? (
    <ProgrammeRenderedView programmeId={programmeId} />
  ) : (
    <Text>Loading...</Text>
  )
}

interface ProgrammeRenderedViewProps {
  programmeId: string
}

const ProgrammeRenderedView = (props: ProgrammeRenderedViewProps) => {
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


export default ProgrammeView;
