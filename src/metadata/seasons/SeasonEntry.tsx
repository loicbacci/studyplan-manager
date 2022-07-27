import { Button, Text, useDisclosure } from "@chakra-ui/react";
import MetadataEntry from "../MetadataEntry";
import SeasonModal from "./SeasonModal";

interface SeasonEntryProps {
  season?: Season;
}

const SeasonEntry = (props: SeasonEntryProps) => {
  const { season } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {season ? (
        <MetadataEntry
          left={<Text>{season.name}</Text>}
          onEdit={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="40">
          Add season
        </Button>
      )}

      <SeasonModal isOpen={isOpen} onClose={onClose} season={season} />
    </>
  );
};

export default SeasonEntry;
