import { Button, Text, useDisclosure } from "@chakra-ui/react";
import MetadataEntry from "../MetadataEntry";
import SemesterModal from "./SemesterModal";

interface SemesterEntryProps {
  semester?: Semester;
}

const SemesterEntry = (props: SemesterEntryProps) => {
  const { semester } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {semester ? (
        <MetadataEntry
          left={<Text>{semester.name}</Text>}
          onEdit={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="40">
          Add semester
        </Button>
      )}

      <SemesterModal isOpen={isOpen} onClose={onClose} semester={semester} />
    </>
  );
};

export default SemesterEntry;
