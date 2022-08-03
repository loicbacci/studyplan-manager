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
  removeCourse: RemoveCourse
}

const CoursesSeasonList = (props: CoursesSeasonListProps) => {
  const { courses, programmeId, updateCourse, removeCourse } = props;

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
            <Stack borderLeft={{ base: "", lg: "1px" }} borderColor="gray"
                   pl={{ base: 0.5, lg: 4 }}
                   spacing={0}>
              {coursesBySeason.sort(sortBySchoolCourseId).map(course => (
                <CoursesListEntry
                  programmeId={programmeId}
                  course={course}
                  updateCourse={updateCourse(course.id)}
                  removeCourse={removeCourse(course.id)}
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