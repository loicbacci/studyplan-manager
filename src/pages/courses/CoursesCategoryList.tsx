import React, { useEffect } from "react";
import { Box, HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import CoursesSubCategoryList from "./CoursesSubCategoryList";
import CoursesSeasonList from "./CoursesSeasonList";
import { objEqual, sortByIndex } from "../../lib/utils";
import { useCategoriesData } from "../../lib/firestore/categories";
import { useMajors } from "../../lib/firestore/majors";
import { useMinors } from "../../lib/firestore/minors";
import { RemoveCourse, UpdateCourse } from "./CoursesList";

interface CoursesCategoryListProps {
  programmeId: string,
  courses: Course[],
  updateCourse: UpdateCourse,
  removeCourse: RemoveCourse,

  coursesIdsToShow?: string[],  // Used to only show some courses
  takenCoursesData?: TakenCourseData[],   // Used to take/untake courses
  onCheck?: (courseId: string, checked: boolean) => void,
  onEdit?: (courseId: string) => void,

  showMinorId?: string,
  showMajorId?: string
}

const CoursesCategoryList = (props: CoursesCategoryListProps) => {
  const { programmeId, showMajorId, showMinorId, onEdit, courses, updateCourse, removeCourse, coursesIdsToShow, takenCoursesData, onCheck } = props;

  const { categoriesData } = useCategoriesData(programmeId);
  const categories = categoriesData ? categoriesData.map(cd => cd.category) : [];

  const { majors: baseMajors } = useMajors(programmeId);
  const { minors: baseMinors } = useMinors(programmeId);

  const majors = (baseMajors && showMajorId) ? baseMajors.filter(m => m.id === showMajorId) : baseMajors;
  const minors = (baseMinors && showMinorId) ? baseMinors.filter(m => m.id === showMinorId) : baseMinors;

  const groupByCategory = (cs: Course[]) => {
    const res = [] as [{ category: Category, major?: Major, minor?: Minor }, Course[]][];

    cs.forEach(course => {
      if (!majors || !minors) return;

      const category = categories.find(c => c.id === course.category_id);
      if (!category) return;

      const major = (category.is_major && course.major_id !== undefined)
        ? majors.find(m => m.id === course.major_id)
        : undefined;

      const minor = (category.is_minor && course.minor_id !== undefined)
        ? minors.find(m => m.id === course.minor_id)
        : undefined;

      const key = { category, major, minor }

      const entry = res.find(([data, _]) => objEqual(data, key))

      if (entry) {
        entry[1].push(course);
      } else {
        res.push([key, [course]]);
      }
    })

    console.log(res)

    return res.sort(([a], [b]) => sortByIndex(a.category, b.category));
  }

  return (
    <>
      {groupByCategory(courses)
        .map(([{ category, major, minor }, cs]) => (
          <CategoryEntry
            category={category}
            programmeId={programmeId}
            courses={cs}
            major={major}
            minor={minor}
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

interface CategoryEntryProps {
  category: Category,
  programmeId: string,
  major?: Major,
  minor?: Minor,
  courses: Course[],
  updateCourse: UpdateCourse,
  removeCourse: RemoveCourse,

  coursesIdsToShow?: string[],  // Used to only show some courses
  takenCoursesData?: TakenCourseData[],   // Used to take/untake courses
  onCheck?: (courseId: string, checked: boolean) => void,
  onEdit?: (courseId: string) => void
}

const CategoryEntry = (props: CategoryEntryProps) => {
  const { category, onEdit, programmeId, major, minor, courses, updateCourse, removeCourse, coursesIdsToShow, takenCoursesData, onCheck } = props;

  const { isOpen, onToggle, onOpen } = useDisclosure();

  useEffect(onOpen, []);

  const { categoriesData } = useCategoriesData(programmeId);

  const takenCourses = (takenCoursesData) ? courses.filter(c => takenCoursesData.some(d => d.course_id === c.id)) : [];
  // @ts-ignore
  const takenCredits = takenCourses.map(c => Number.parseInt(c.credits)).reduce((acc, curVal) => acc + curVal, 0);

  const getSubCategories = (categoryId: string) => {
    if (!categoriesData) return null;
    const data = categoriesData.find(cd => cd.category.id === categoryId);

    if (!data) return null;
    return data.subCategories ? data.subCategories : null;
  }

  const subCategories = getSubCategories(category.id);
  const hasSubcategories = subCategories !== null;

  let title = category.name;

  if (major) {
    title += ` (${major.name})`
  }
  if (minor) {
    title += ` (${minor.name})`
  }

  const bgColor = () => {
    if (takenCoursesData && category.min_credits) {
      if (takenCredits < category.min_credits) return "red.200";
      else return "green.200";
    } else {
      return undefined;
    }
  }

  return (
    <Stack fontSize={{ base: "15px", lg: "" }}>
      <HStack justify="space-between" bgColor={bgColor()}>
        <Text fontWeight="semibold" onClick={onToggle} _hover={{ cursor: "pointer" }}>
          {title}
        </Text>

        {(takenCoursesData && courses) && (
          <Text fontWeight={bgColor() === undefined ? "semibold" : undefined}>
            Taken {takenCredits}{category.min_credits && `/${category.min_credits}`} credits
          </Text>
        )}
      </HStack>

      {isOpen && (
        <Box pl={{ base: 0.5, lg: 2 }}>
          <Stack borderLeft={{ base: "", lg: "1px" }} borderColor="gray" pl={{ base: 0.5, lg: 4 }}>
            {hasSubcategories ? (
              // Grouped by subcategory
              <CoursesSubCategoryList
                courses={courses}
                programmeId={programmeId}
                categoryId={category.id}
                updateCourse={updateCourse}
                removeCourse={removeCourse}
                coursesIdsToShow={coursesIdsToShow}
                takenCoursesData={takenCoursesData}
                onCheck={onCheck}
                onEdit={onEdit}
              />
            ) : (
              // Grouped by season
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
            )}
          </Stack>
        </Box>
      )}
    </Stack>
  )
}

export default CoursesCategoryList;