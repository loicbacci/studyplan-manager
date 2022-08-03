import React from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import { CoursesListEntry } from "./CoursesListEntry";
import { RemoveCourse, UpdateCourse } from "./CoursesList";
import { useSeasons } from "../../lib/firestore/seasons";
import { sortById, sortBySchoolCourseId } from "../../lib/utils";

interface CoursesSeasonListProps {
  courses: Course[],
  programmeId: string,
  updateCourse: UpdateCourse,
  removeCourse: RemoveCourse,

  coursesIdsToShow?: string[],  // Used to only show some courses
  chosenCoursesIds?: string[],   // Used to take/untake courses
  onCheck?: (courseId: string, checked: boolean) => void
}

const CoursesSeasonList = (props: CoursesSeasonListProps) => {
  const {
    courses: coursesData, programmeId, updateCourse, removeCourse, coursesIdsToShow, chosenCoursesIds, onCheck
  } = props;

  const courses = coursesIdsToShow ? coursesData.filter(c => coursesIdsToShow.some(cid => cid === c.id)) : coursesData;

  const { seasons } = useSeasons(programmeId)

  const entrySort = (a: [Season, Course[]], b: [Season, Course[]]) => {
    return a[0].name.localeCompare(b[0].name);
  }

  const groupBySeason = (cs: Course[]) => {
    const res = new Map<Season, Course[]>();

    cs.forEach(course => {
      if (!seasons) return;

      const season = seasons.find(s => s.id === course.season_id);
      if (!season) return;

      if (res.has(season)) {
        res.get(season)?.push(course);
      } else {
        res.set(season, [course]);
      }
    })

    return [...res.entries()].sort(entrySort);
  }

  return (
    <>
      {groupBySeason(courses).map(([season, coursesBySeason]) => (
        <>
          <Text fontWeight="semibold">{season.name}</Text>

          <Box pl={{ base: 0.5, lg: 2 }}>
            <Stack
              borderLeft={{ base: "", lg: "1px" }}
              borderColor="gray"
              pl={{ base: 0.5, lg: 4 }}
              spacing={0}
            >
              {coursesBySeason.sort(sortBySchoolCourseId).map(course => (
                <CoursesListEntry
                  programmeId={programmeId}
                  course={course}
                  updateCourse={updateCourse(course.id)}
                  removeCourse={removeCourse(course.id)}
                  isChecked={chosenCoursesIds ? chosenCoursesIds.some(cid => cid === course.id) : undefined}
                  onCheck={(v) => onCheck && onCheck(course.id, v)}
                  key={course.id}
                />
              ))}
            </Stack>
          </Box>
        </>
      ))}
    </>)
}

export default CoursesSeasonList;