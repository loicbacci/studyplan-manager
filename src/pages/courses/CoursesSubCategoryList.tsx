import React, { useEffect } from "react";
import { Box, HStack, LinkBox, LinkOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react";
import CoursesSeasonList from "./CoursesSeasonList";
import { sortByIndex } from "../../lib/utils";
import { useCategoriesData } from "../../lib/firestore/categories";
import { RemoveCourse, UpdateCourse } from "./CoursesList";
import { useCourses } from "../../lib/firestore/courses";

interface CoursesSubCategoryListProps {
  courses: Course[],
  programmeId: string,
  categoryId: string,
  updateCourse: UpdateCourse,
  removeCourse: RemoveCourse,

  coursesIdsToShow?: string[],  // Used to only show some courses
  takenCoursesData?: TakenCourseData[],   // Used to take/untake courses
  onCheck?: (courseId: string, checked: boolean) => void,
  onEdit?: (courseId: string) => void
}

const CoursesSubCategoryList = (props: CoursesSubCategoryListProps) => {
  const { programmeId, categoryId, onEdit, courses, updateCourse, removeCourse, coursesIdsToShow, takenCoursesData, onCheck } = props;

  const { categoriesData } = useCategoriesData(programmeId);

  const getSubCategories = (categoryId: string) => {
    if (!categoriesData) return null;
    const data = categoriesData.find(cd => cd.category.id === categoryId);

    if (!data) return null;
    return data.subCategories ? data.subCategories : null;
  }

  const groupBySubCategory = (cs: Course[], categoryId: string) => {
    const res = new Map<SubCategory, Course[]>();

    const subCategories = getSubCategories(categoryId);

    if (subCategories) {
      cs.forEach(course => {
        const subcategory = subCategories.find(sc => sc.id === course.subcategory_id);
        if (!subcategory) return;

        if (res.has(subcategory)) {
          res.get(subcategory)?.push(course);
        } else {
          res.set(subcategory, [course]);
        }
      })
    }

    return [...res.entries()].sort(([a], [b]) => sortByIndex(a, b));
  }

  return (
    <>
      {groupBySubCategory(courses, categoryId).map(([subCategory, cs]) => (
        <SubCategoryEntry
          subCategory={subCategory}
          courses={cs}
          programmeId={programmeId}
          updateCourse={updateCourse}
          removeCourse={removeCourse}
          coursesIdsToShow={coursesIdsToShow}
          takenCoursesData={takenCoursesData}
          onCheck={onCheck}
          onEdit={onEdit}
        />
      ))}
    </>
  )
}

interface SubCategoryEntryProps {
  subCategory: SubCategory,
  courses: Course[],
  programmeId: string,
  updateCourse: UpdateCourse,
  removeCourse: RemoveCourse,

  coursesIdsToShow?: string[],  // Used to only show some courses
  takenCoursesData?: TakenCourseData[],   // Used to take/untake courses
  onCheck?: (courseId: string, checked: boolean) => void,
  onEdit?: (courseId: string) => void
}

const SubCategoryEntry = (props: SubCategoryEntryProps) => {
  const { subCategory, courses, onEdit, programmeId, updateCourse, removeCourse, coursesIdsToShow, takenCoursesData, onCheck } = props;

  const { isOpen, onToggle, onOpen } = useDisclosure();

  useEffect(onOpen, []);

  const takenCourses = (takenCoursesData) ? courses.filter(c => takenCoursesData.some(d => d.course_id === c.id)) : [];
  // @ts-ignore
  const takenCredits = takenCourses.map(c => Number.parseInt(c.credits)).reduce((acc, curVal) => acc + curVal, 0);


  const bgColor = () => {
    if (takenCoursesData && subCategory.min_credits) {
      if (takenCredits < subCategory.min_credits) return "red.200";
      else return "green.200";
    } else {
      return undefined;
    }
  }

  return (
    <>
      <HStack justify="space-between" bgColor={bgColor()}>
        <Text fontWeight="semibold" onClick={onToggle} _hover={{ cursor: "pointer" }}>
          {subCategory.name}
        </Text>

        {((takenCoursesData) && courses) && (
          <Text fontWeight={bgColor() === undefined ? "semibold" : undefined}>
            Taken {takenCredits}{subCategory.min_credits && `/${subCategory.min_credits}`} credits
          </Text>
        )}
      </HStack>



      {isOpen && <Box pl={{ base: 0.5, lg: 2 }}>
        <Stack
          borderLeft={{ base: "", lg: "1px" }}
          borderColor="gray"
          pl={{ base: 0.5, lg: 4 }}
          spacing={0}
        >
          <CoursesSeasonList
            courses={courses}
            programmeId={programmeId}
            updateCourse={updateCourse}
            removeCourse={removeCourse}
            coursesIdsToShow={coursesIdsToShow}
            takenCoursesData={takenCoursesData}
            onCheck={onCheck}
            onEdit={onEdit}
          />
        </Stack>
      </Box>}
    </>
  )
}

export default CoursesSubCategoryList;