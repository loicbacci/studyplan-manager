import React from "react";
import { Heading, HStack, IconButton, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddSeasonButton, SeasonsListEntry } from "./SeasonsListEntry";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useSeasons } from "../../lib/firestore/seasons";

interface SeasonsListProps {
  programmeId: string
}

const SeasonsList = (props: SeasonsListProps) => {
  const { programmeId } = props;
  const { isOpen, onToggle } = useDisclosure();

  const { seasons, add, update, remove } = useSeasons(programmeId);
  const toast = useToast();


  const addSeason = (name: string) => {
    add({ name })
      .then(() => toast(toastSuccessOptions("Successfully added season")))
      .catch(() => toast(toastErrorOptions("Failed to add season")));
  }

  const renameSeason = (seasonId: string) => (newName: string) => {
    update({ id: seasonId, name: newName })
      .then(() => toast(toastSuccessOptions("Successfully edited season")))
      .catch(() => toast(toastErrorOptions("Failed to edit season")));
  }

  const removeSeason = (seasonId: string) => () => {
    remove(seasonId)
      .then(() => toast(toastSuccessOptions("Successfully removed season")))
      .catch(() => toast(toastErrorOptions("Failed to remove season")));
  }

  const Body = (
    <>
      {(seasons && seasons.length === 0) && <Text color="gray">No seasons yet</Text>}
      <Stack>
        {seasons && seasons.map(season => (
          <SeasonsListEntry
            season={season}
            renameSeason={renameSeason(season.id)}
            removeSeason={removeSeason(season.id)}
            key={season.id}
          />
        ))}
      </Stack>

      <AddSeasonButton addSeason={addSeason}/>
    </>
  )

  return (
    <Stack
      borderWidth="1px"
      borderRadius="md"
      py={{ base: 1, lg: 2 }}
      pb={{ base: 1, lg: 2 }}
      px={{ base: 2, lg: 4 }}
      w="100%"
    >
      <HStack justify="space-between">
        <Heading size="md" mb={{ base: 0, lg: 2 }}>
          Seasons
        </Heading>

        <IconButton
          variant="ghost"
          aria-label="Open menu"
          icon={isOpen ? <FiChevronUp/> : <FiChevronDown fontSize="1.25rem"/>}
          onClick={onToggle}
        />
      </HStack>

      {isOpen && Body}
    </Stack>
  )
}

export default SeasonsList;