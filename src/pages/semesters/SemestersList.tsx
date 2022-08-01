import React from "react";
import { Heading, HStack, IconButton, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddSeasonButton, SemestersListEntry } from "./SemestersListEntry";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useSeasons } from "../../lib/firestore/seasons";
import { useSemesters } from "../../lib/firestore/semesters";

interface SemestersListProps {
  programmeId: string
}

const SemestersList = (props: SemestersListProps) => {
  const { programmeId } = props;
  const { isOpen, onToggle } = useDisclosure();

  const { semesters, add, update, remove } = useSemesters(programmeId);
  const { seasons } = useSeasons(programmeId);
  const toast = useToast();


  const addSemester = (name: string, season_id: string) => {
    if (!semesters) {
      toast(toastErrorOptions("Semesters not loaded"));
      return;
    }

    const index = semesters.length !== 0 ? Math.max(...semesters.map(s => s.index)) + 1 : 0;

    add({ name, season_id, index })
      .then(() => toast(toastSuccessOptions("Successfully added semester")))
      .catch(() => toast(toastErrorOptions("Failed to add semester")));
  }

  const updateSemester = (id: string, index: number) => (name: string, season_id: string) => {
    update({ id, name, index, season_id })
      .then(() => toast(toastSuccessOptions("Successfully edited semester")))
      .catch(() => toast(toastErrorOptions("Failed to edit semester")));
  }

  const removeSemester = (id: string) => () => {
    remove(id)
      .then(() => toast(toastSuccessOptions("Successfully removed semester")))
      .catch(() => toast(toastErrorOptions("Failed to remove semester")));
  }

  const upIndex = (semesterIndex: number) => () => {
    if (!semesters) return;

    const toMoveUp = semesters.find(sem => sem.index === semesterIndex);
    const toMoveDown = semesters.find(sem => sem.index === semesterIndex - 1);

    if (!toMoveUp || !toMoveDown) return;

    update({ ...toMoveUp, index: toMoveUp.index - 1 });
    update({ ...toMoveDown, index: toMoveDown.index + 1 });
  }

  const downIndex = (semesterIndex: number) => () => {
    if (!semesters) return;

    const toMoveDown = semesters.find(sem => sem.index === semesterIndex);
    const toMoveUp = semesters.find(sem => sem.index === semesterIndex + 1);


    if (!toMoveUp || !toMoveDown) return;

    update({ ...toMoveUp, index: toMoveUp.index - 1 });
    update({ ...toMoveDown, index: toMoveDown.index + 1 });
  }

  const Body = (
    <>
      {(semesters && semesters.length === 0) && <Text color="gray">No semesters yet</Text>}
      <Stack>
        {(semesters && seasons) && semesters.sort((a, b) => a.index - b.index).map(semester => (
          <SemestersListEntry
            seasons={seasons}
            semester={semester}
            updateSemester={updateSemester(semester.id, semester.index)}
            removeSemester={removeSemester(semester.id)}
            key={semester.id}
            upIndex={semester.index != 0 ? upIndex(semester.index) : undefined}
            downIndex={semester.index != semesters.length - 1 ? downIndex(semester.index) : undefined}
          />
        ))}
      </Stack>

      {seasons && <AddSeasonButton addSemester={addSemester} seasons={seasons}/>}
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
          Semesters
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

export default SemestersList;