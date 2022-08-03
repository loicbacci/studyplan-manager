import React from "react";
import { Button, Center, Flex, IconButton, Stack, Text, useDisclosure } from "@chakra-ui/react";
import Entry from "../../components/Entry";
import DataModal from "../../components/DataModal";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface SemestersListEntryBaseProps {
  seasons: Season[],
  semester?: Semester,
  addSemester?: (name: string, season_id: string) => void,
  updateSemester?: (name: string, season_id: string) => void,
  removeSemester?: () => void,

  upIndex?: () => void,
  downIndex?: () => void
}

const SemestersListEntryBase = (props: SemestersListEntryBaseProps) => {
  const { seasons, semester, addSemester, updateSemester, removeSemester, upIndex, downIndex } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const corrSeason = semester ? seasons.find(s => s.id === semester.season_id) : undefined
  const isEditing = semester !== undefined && updateSemester !== undefined && removeSemester !== undefined;
  const isAdding = addSemester !== undefined;

  const nameField: TextField = {
    name: "name",
    initialValue: semester ? semester.name : "",
    label: "Name",
    placeholder: "Enter name",
    validate: (v) => v === "" ? "Please enter name" : "",
    isRequired: true
  }

  const seasonIdField: TextSelectField = {
    name: "season_id",
    initialValue: semester ? semester.season_id : "",
    label: "Corresponding season",
    placeholder: "Please enter season",
    validate: (v) => (v === "" || v === seasonIdField.placeholder) ? "Please enter season" : "",
    isRequired: true,
    possibleValues: seasons.map(s => s.id),
    possibleValuesLabels: seasons.map(s => s.name)
  }

  const onSubmit = (elem: Omit<Semester, "id">) => {
    if (isEditing) {
      // EDIT
      updateSemester(elem.name, elem.season_id);
    } else if (isAdding) {
      // ADD
      addSemester(elem.name, elem.season_id);
    }

    onClose();
  }

  const onDelete = () => {
    if (isEditing) {
      removeSemester();
    }

    onClose();
  }

  return (
    <>
      {isEditing ? (
        <Entry
          left={
            <Stack spacing={0}>
              <Text>{semester.name}</Text>
              {corrSeason && <Text color="gray">{corrSeason.name}</Text>}
            </Stack>
          }
          right={
            <Stack spacing={0}>
              {upIndex && (
                <IconButton
                  aria-label="up-index"
                  size="sm"
                  h={downIndex ? "5" : undefined}
                  borderRadius={downIndex ? 0 : "md"}
                  borderTopLeftRadius="md"
                  borderTopRightRadius="md"
                  icon={<FiChevronUp/>}
                  onClick={upIndex}
                />
              )}
              {downIndex && (
                <IconButton
                  aria-label="up-index"
                  size="sm"
                  h={upIndex ? "5" : undefined}
                  borderRadius={upIndex ? 0 : "md"}
                  borderBottomLeftRadius="md"
                  borderBottomRightRadius="md"
                  icon={<FiChevronDown/>}
                  onClick={downIndex}
                />
              )}
            </Stack>
          }
          onClick={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="fit-content" size="sm">
          Add semester
        </Button>
      )}

      <DataModal
        headerTitle={<Text>{isEditing ? "Edit" : "Add"} Semester</Text>}
        alertTitle={<Text>Delete Semester</Text>}
        fields={[nameField, seasonIdField]}
        onSubmit={onSubmit}
        onDelete={isEditing ? onDelete : undefined}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>

  )
}

interface SemestersListEntryProps {
  seasons: Season[],
  semester: Semester,
  updateSemester: (name: string, season_id: string) => void,
  removeSemester: () => void,
  upIndex?: () => void,
  downIndex?: () => void
}

export const SemestersListEntry = (props: SemestersListEntryProps) => {
  return (
    <SemestersListEntryBase {...props}/>
  )
}

interface AddSeasonButtonProps {
  seasons: Season[],
  addSemester: (name: string, season_id: string) => void
}

export const AddSeasonButton = (props: AddSeasonButtonProps) => {
  return (
    <SemestersListEntryBase {...props}/>
  )
}
