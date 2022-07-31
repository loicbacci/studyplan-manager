import React from "react";
import ProgrammesListEntryBase from "./ProgrammesListEntryBase";

interface AddProgrammeButtonProps {
  addProgramme: (name: string) => void,
}

const AddProgrammeButton = (props: AddProgrammeButtonProps) => {
  const { addProgramme } = props;
  return (
    <ProgrammesListEntryBase
      addProgramme={addProgramme}
    />
  )
}

export default AddProgrammeButton;
