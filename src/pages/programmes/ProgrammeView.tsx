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
  Text
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

  if (!programme) {
    return (
      <Text>Programme {programmeId} not found.</Text>
    )
  }

  return (
    <Stack spacing={4}>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={RLink} to={"/programmes"}>
            Programmes
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink color="gray" as={RLink} to={`/programmes/${programmeId}`}>
            {programme.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading mb={2}>{programme.name}</Heading>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <MajorsList programmeId={programme.id} />
        </GridItem>
        <GridItem>
          <MinorsList programmeId={programme.id} />
        </GridItem>
      </Grid>

      <CategoriesList programmeId={programme.id} />

    </Stack>
  )
}


export default ProgrammeViewLoader;
