import React from "react";
import { Button, Text, useDisclosure } from "@chakra-ui/react";
import Entry from "../../components/Entry";
import DataModal from "../../components/DataModal";

interface SeasonsListEntryBaseProps {
  season?: Season,
  addSeason?: (name: string) => void,
  renameSeason?: (newName: string) => void,
  removeSeason?: () => void
}

const SeasonsListEntryBase = (props: SeasonsListEntryBaseProps) => {
  const { season, addSeason, renameSeason, removeSeason } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEditing = season !== undefined && renameSeason !== undefined && removeSeason !== undefined;
  const isAdding = addSeason !== undefined;

  const nameField: TextField = {
    name: "name",
    initialValue: season ? season.name : "",
    label: "Name",
    placeholder: "Enter name",
    validate: (v) => v === "" ? "Please enter name" : "",
    isRequired: true
  }

  const onSubmit = (elem: Omit<Major, "id">) => {
    if (isEditing) {
      // EDIT
      renameSeason(elem.name);
    } else if (isAdding) {
      // ADD
      addSeason(elem.name);
    }

    onClose();
  }

  const onDelete = () => {
    if (isEditing) {
      removeSeason();
    }

    onClose();
  }

  return (
    <>
      {isEditing ? (
        <Entry
          left={<Text>{season.name}</Text>}
          onClick={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="fit-content" size="sm">
          Add season
        </Button>
      )}

      <DataModal
        headerTitle={<Text>{isEditing ? "Edit" : "Add"} Season</Text>}
        alertTitle={<Text>Delete Season</Text>}
        fields={[nameField]}
        onSubmit={onSubmit}
        onDelete={isEditing ? onDelete : undefined}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>

  )
}

interface SeasonsListEntryProps {
  season: Season,
  renameSeason: (newName: string) => void,
  removeSeason: () => void
}

export const SeasonsListEntry = (props: SeasonsListEntryProps) => {
  const { season, renameSeason, removeSeason } = props;

  return (
    <SeasonsListEntryBase
      season={season}
      renameSeason={renameSeason}
      removeSeason={removeSeason}
    />
  )
}

interface AddSeasonButtonProps {
  addSeason: (name: string) => void
}

export const AddSeasonButton = (props: AddSeasonButtonProps) => {
  const { addSeason } = props;

  return (
    <SeasonsListEntryBase
      addSeason={addSeason}
    />
  )
}
