import React from "react";
import {Button, Stack} from "@chakra-ui/react";
import {useDatabase} from "../firebase/database";
import ProgrammeListEntry from "./ProgrammeListEntry";

const ProgrammesList = () => {
  const { programmes } = useDatabase();

  return (
    <Stack>
      {programmes && programmes.map(p => (
        <ProgrammeListEntry programme={p} />
      ))}

      <ProgrammeListEntry />
    </Stack>
  )
}

export default ProgrammesList;
