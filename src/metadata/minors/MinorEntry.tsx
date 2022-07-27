import { Button, Text, useDisclosure } from "@chakra-ui/react";
import MetadataEntry from "../MetadataEntry";
import MinorModal from "./MinorModal";

interface MinorEntryProps {
  minor?: Minor;
}

const MinorEntry = (props: MinorEntryProps) => {
  const { minor } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {minor ? (
        <MetadataEntry
          left={<Text>{minor.name}</Text>}
          onEdit={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="40">
          Add minor
        </Button>
      )}

      <MinorModal isOpen={isOpen} onClose={onClose} minor={minor} />
    </>
  );
};

export default MinorEntry;
