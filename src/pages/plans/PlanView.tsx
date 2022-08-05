import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  Heading,
  HStack, SimpleGrid,
  Stack,
  Text,
  useDisclosure, Wrap
} from "@chakra-ui/react";
import { usePlan, useTakenCourses } from "../../lib/firestore/plans";
import { useProgramme } from "../../lib/firestore/programmes";
import { useMajors } from "../../lib/firestore/majors";
import { useMinors } from "../../lib/firestore/minors";
import { useCourses } from "../../lib/firestore/courses";
import CoursesList from "../courses/CoursesList";
import { useSemesters } from "../../lib/firestore/semesters";
import DataModal from "../../components/DataModal";
import { sortByIndex } from "../../lib/utils";
import { useSeasons } from "../../lib/firestore/seasons";

const PlanViewLoader = () => {
  const { planId } = useParams();

  if (!planId) {
    return <div/>
  }

  return <PlanViewPlanLoader planId={planId}/>
}

interface PlanViewPlanLoaderProps {
  planId: string
}

const PlanViewPlanLoader = ({ planId }: PlanViewPlanLoaderProps) => {
  const { plan } = usePlan(planId);

  if (!plan) {
    return (
      <Text>Plan {planId} not found.</Text>
    )
  }

  return <PlanViewProgrammeLoader plan={plan}/>
}

interface PlanViewProgrammeLoaderProps {
  plan: Plan
}

const PlanViewProgrammeLoader = ({ plan }: PlanViewProgrammeLoaderProps) => {
  const { programme } = useProgramme(plan.programme_id);

  if (!programme) {
    return (
      <Text>Programme {plan.programme_id} not found.</Text>
    )
  }

  return <PlanView plan={plan} programme={programme}/>
}

interface PlanViewProps {
  plan: Plan,
  programme: Programme
}

const PlanView = (props: PlanViewProps) => {
  const { plan, programme } = props;
  const { takenCoursesData, add, update, remove } = useTakenCourses(plan.id);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [editingCourseId, setEditingCourseId] = useState(null as string | null);
  const [editing, setEditing] = useState(false);

  const { seasons } = useSeasons(programme.id);
  const { majors } = useMajors(programme.id);
  const { minors } = useMinors(programme.id);
  const { courses } = useCourses(programme.id);
  const { semesters: baseSemesters } = useSemesters(programme.id);
  const semesters = baseSemesters ? baseSemesters.sort(sortByIndex) : undefined;

  const major = majors ? majors.find(m => m.id === plan.chosen_major_id) : undefined;
  const minor = minors ? minors.find(m => m.id === plan.chosen_minor_id) : undefined;

  const takenCourses = (courses && takenCoursesData)
    ? courses.filter(c => takenCoursesData.some(data => data.course_id === c.id))
    : [];

  const creditsInSemester = (semesterId: string) => {
    if (!takenCoursesData || !courses) return 0;
    const courseIdsInSemester = takenCoursesData.filter(c => c.semester_id === semesterId).map(d => d.course_id);
    // @ts-ignore
    return courses.filter(c => courseIdsInSemester.some(id => c.id === id)).map(c => Number.parseInt(c.credits))
      .reduce((a, b) => a + b, 0)
  }

  const onCheck = (courseId: string, checked: boolean) => {
    if (!checked) {
      if (!takenCoursesData) return;
      const courseData = takenCoursesData.find(d => d.course_id === courseId);
      if (!courseData) return;
      remove(courseData.id);

    } else {
      setEditing(false);
      setEditingCourseId(courseId);
      onOpen();
    }
  }

  const findSemesterIdEditing = () => {
    if (!editingCourseId || !takenCoursesData) return "";
    const data = takenCoursesData.find(d => d.course_id === editingCourseId);
    if (!data) return "";
    return data.semester_id;
  }

  const getEditingCourse = () => {
    if (!editingCourseId || !courses) return undefined;
    return courses.find(c => c.id === editingCourseId);
  }

  const getPossibleSemesters = () => {
    if (!semesters) return [];

    const course = getEditingCourse();
    if (!course) return [];

    return semesters.filter(sem => sem.season_id === course.season_id)
  }

  const semesterIdPlaceholder = "Enter Semester"

  const semesterIdField: TextSelectField = {
    name: "semester_id",
    initialValue: findSemesterIdEditing(),
    label: "Semester",
    placeholder: semesterIdPlaceholder,
    validate: (v: string) => (v === "" || v === semesterIdPlaceholder) ? "Please enter semester" : "",
    isRequired: true,

    possibleValues: getPossibleSemesters().map(s => s.id),
    possibleValuesLabels: getPossibleSemesters().map(s => s.name)
  }

  const onEdit = (courseId: string) => {
    setEditing(true);
    setEditingCourseId(courseId);
    onOpen();
  }

  const onSubmit = (elem: Omit<TakenCourseData, "id">) => {
    console.log(elem, editing, editingCourseId);

    if (editing) {
      // Editing
      if (takenCoursesData && editingCourseId) {
        const baseData = takenCoursesData.find(d => d.course_id === editingCourseId);

        if (baseData) {
          update({ id: baseData.id, course_id: elem.course_id, semester_id: elem.semester_id });
        }
      }
    } else {
      if (!editingCourseId) return;
      add({ course_id: editingCourseId, semester_id: elem.semester_id })
    }

    setEditingCourseId(null);
    onClose();
  }

  return (
    <>
      <Stack spacing={4}>
        <Heading mb={2}>{plan.name}</Heading>

        {plan.notes && (
          <Text>{plan.notes}</Text>
        )}

        <Divider/>

        <Stack spacing={6}>
          <Stack>
            <HStack>
              <Text fontWeight="semibold">Programme:</Text>
              <Text>{programme.name}</Text>
            </HStack>

            {major && (
              <HStack>
                <Text fontWeight="semibold">Major:</Text>
                <Text>{major.name}</Text>
              </HStack>
            )}

            {minor && (
              <HStack>
                <Text fontWeight="semibold">Minor:</Text>
                <Text>{minor.name}</Text>
              </HStack>
            )}
          </Stack>

          <Stack>
            <Heading size="md">Credits per semester</Heading>
            <SimpleGrid columns={seasons ? seasons.length : 2}>
              {seasons && seasons.map(s => <Heading size="sm" pb={2}>{s.name}</Heading>)}
              {semesters && semesters.map(semester => (
                <HStack key={semester.id}>
                  <Text fontWeight="semibold">{semester.name}:</Text>
                  <Text>{creditsInSemester(semester.id)} credits</Text>
                </HStack>
              ))}
            </SimpleGrid>

          </Stack>

          <Stack>
            <Heading size="md">Taken courses</Heading>
            {takenCourses.length === 0 && <Text color="gray">No courses taken yet.</Text>}

            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Text>Show taken courses</Text>
                  <AccordionIcon/>
                </AccordionButton>

                <AccordionPanel>
                  <CoursesList
                    programmeId={programme.id}
                    takenCoursesData={takenCoursesData ? takenCoursesData : undefined}
                    coursesIdsToShow={takenCourses.map(c => c.id)}
                    noBorder
                    onEdit={onEdit}

                    showMinorId={plan.chosen_minor_id}
                    showMajorId={plan.chosen_major_id}
                  />
                </AccordionPanel>
              </AccordionItem>

              {takenCoursesData && (
                <AccordionItem>
                  <AccordionButton>
                    <Text>Take courses</Text>
                    <AccordionIcon/>
                  </AccordionButton>

                  <AccordionPanel>
                    <CoursesList
                      programmeId={programme.id}
                      takenCoursesData={takenCoursesData}
                      onCheck={onCheck}
                      noBorder

                      showMinorId={plan.chosen_minor_id}
                      showMajorId={plan.chosen_major_id}
                    />
                  </AccordionPanel>
                </AccordionItem>
              )}
            </Accordion>
          </Stack>
        </Stack>

      </Stack>

      <DataModal
        headerTitle={<Text>{editingCourseId ? "Edit " : "Add "}Taken course</Text>}
        alertTitle={<Text>Taken course</Text>}
        fields={[semesterIdField]}
        onSubmit={onSubmit}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>

  )
}


export default PlanViewLoader;
