import React from "react";
import ProgrammesListEntryBase from "./ProgrammesListEntryBase";

interface ProgrammesListEntryProps {
  programme: Programme,
  renameProgramme: (newName: string) => void,
  removeProgramme: () => void
}

const ProgrammesListEntry = (props: ProgrammesListEntryProps) => {
  const { programme, renameProgramme, removeProgramme } = props;
  return (
    <ProgrammesListEntryBase
      programme={programme}
      renameProgramme={renameProgramme}
      removeProgramme={removeProgramme}
    />
  )
}

export default ProgrammesListEntry;
