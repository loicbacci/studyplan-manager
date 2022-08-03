import React from "react";
import { Heading, HStack, IconButton, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddCourseButton } from "./CoursesListEntry";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useCategoriesData } from "../../lib/firestore/categories";
import { useCourses } from "../../lib/firestore/courses";
import { useSeasons } from "../../lib/firestore/seasons";
import CoursesCategoryList from "./CoursesCategoryList";

export type UpdateCourse = (courseId: string) => (
  school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
  subcategory_id?: string, major_id?: string, minor_id?: string
) => void;

export type RemoveCourse = (courseId: string) => () => void

interface CoursesListProps {
  programmeId: string
}

const CoursesList = (props: CoursesListProps) => {
  const { programmeId } = props;
  const { isOpen, onToggle } = useDisclosure();

  const { courses, add, update, remove } = useCourses(programmeId);
  const { categoriesData } = useCategoriesData(programmeId);
  const { seasons } = useSeasons(programmeId);

  const toast = useToast();

  const addCourse = (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string, major_id?: string, minor_id?: string
  ) => {
    add({ school_course_id, name, link, credits, season_id, category_id, subcategory_id, major_id, minor_id })
      .then(() => toast(toastSuccessOptions("Successfully added course")))
      .catch(() => toast(toastErrorOptions("Failed to add major")));
  }

  const updateCourse = (courseId: string) => (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string, major_id?: string, minor_id?: string
  ) => {
    update({
      id: courseId, school_course_id, name, link, credits, season_id, category_id, subcategory_id, major_id, minor_id
    })
      .then(() => toast(toastSuccessOptions("Successfully edited course")))
      .catch(() => toast(toastErrorOptions("Failed to edit course")));
  }

  const removeCourse = (courseId: string) => () => {
    remove(courseId)
      .then(() => toast(toastSuccessOptions("Successfully removed course")))
      .catch(() => toast(toastErrorOptions("Failed to remove course")));
  }


  const Body = (
    <>
      {(courses && courses.length === 0) && <Text color="gray">No courses yet</Text>}
      <Stack>
        {courses && (
          <CoursesCategoryList
            programmeId={programmeId}
            courses={courses}
            updateCourse={updateCourse}
            removeCourse={removeCourse}
          />
        )}
      </Stack>

      {(categoriesData && seasons) && (
        <AddCourseButton programmeId={programmeId} addCourse={addCourse}/>
      )}
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
          Courses
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

export default CoursesList;