import React from "react";
import { useParams } from "react-router-dom";
import {
  Accordion, AccordionButton, AccordionIcon,
  AccordionItem, AccordionPanel,
  Divider,
  Heading,
  HStack,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tr
} from "@chakra-ui/react";
import { usePlan } from "../../lib/firestore/plans";
import { useProgramme } from "../../lib/firestore/programmes";
import { useMajors } from "../../lib/firestore/majors";
import { useMinors } from "../../lib/firestore/minors";
import { useCourses } from "../../lib/firestore/courses";
import CoursesList from "../courses/CoursesList";

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
  const { plan, takeCourse } = usePlan(planId);

  if (!plan) {
    return (
      <Text>Plan {planId} not found.</Text>
    )
  }

  return <PlanViewProgrammeLoader plan={plan} takeCourse={takeCourse}/>
}

interface PlanViewProgrammeLoaderProps {
  plan: Plan,
  takeCourse: (courseId: string, take: boolean) => Promise<void>
}

const PlanViewProgrammeLoader = ({ plan, takeCourse }: PlanViewProgrammeLoaderProps) => {
  const { programme } = useProgramme(plan.programme_id);

  if (!programme) {
    return (
      <Text>Programme {plan.programme_id} not found.</Text>
    )
  }

  return <PlanView plan={plan} takeCourse={takeCourse} programme={programme}/>
}

interface PlanViewProps {
  plan: Plan,
  takeCourse: (courseId: string, take: boolean) => Promise<void>
  programme: Programme
}

const PlanView = (props: PlanViewProps) => {
  const { plan, programme, takeCourse } = props;

  const { majors } = useMajors(programme.id);
  const { minors } = useMinors(programme.id);
  const { courses } = useCourses(programme.id);

  const major = majors ? majors.find(m => m.id === plan.chosen_major_id) : undefined;
  const minor = minors ? minors.find(m => m.id === plan.chosen_minor_id) : undefined;

  const chosenCourses = courses ? courses.filter(c => plan.chosen_courses_ids.some(cid => cid === c.id)) : []


  return (
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
          <Heading size="md">Chosen courses</Heading>
          {chosenCourses.length === 0 && <Text color="gray">No courses taken yet.</Text>}

          <Accordion>
            <AccordionItem>
              <AccordionButton>
                <Text>Show taken courses</Text>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel>
                <CoursesList
                  programmeId={programme.id}
                  coursesIdsToShow={chosenCourses.map(c => c.id)}
                  noBorder
                />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Text>Take courses</Text>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel>
                <CoursesList
                  programmeId={programme.id}
                  chosenCoursesIds={chosenCourses.map(c => c.id)}
                  onCheck={takeCourse}
                  noBorder
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
      </Stack>

    </Stack>
  )
}


export default PlanViewLoader;
