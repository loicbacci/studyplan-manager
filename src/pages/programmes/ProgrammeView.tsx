import React from "react";
import { Link as RLink, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spacer,
  Stack,
  Text, useBreakpointValue
} from "@chakra-ui/react";
import { useProgramme } from "../../lib/firestore/programmes";
import MajorsList from "../majors/MajorsList";
import MinorsList from "../minors/MinorsList";
import CategoriesList from "../categories/CategoriesList";

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

      {isDesktop ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <MajorsList programmeId={programme.id} />
          </GridItem>
          <GridItem>
            <MinorsList programmeId={programme.id} />
          </GridItem>
        </Grid>
      ) : (
        <Stack>
          <MajorsList programmeId={programme.id} />
          <MinorsList programmeId={programme.id} />
        </Stack>
      )}


      <CategoriesList programme={programme} />

    </Stack>
  )
}


export default ProgrammeViewLoader;
