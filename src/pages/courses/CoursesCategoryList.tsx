import React, { useEffect } from "react";
import { Box, Stack, Text, useDisclosure } from "@chakra-ui/react";
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
  chosenCoursesIds?: string[],   // Used to take/untake courses
  onCheck?: (courseId: string, checked: boolean) => void
}

const CoursesCategoryList = (props: CoursesCategoryListProps) => {
  const { programmeId, courses, updateCourse, removeCourse, coursesIdsToShow, chosenCoursesIds, onCheck } = props;

  const { categoriesData } = useCategoriesData(programmeId);
  const categories = categoriesData ? categoriesData.map(cd => cd.category) : [];

  const { majors } = useMajors(programmeId);
  const { minors } = useMinors(programmeId);


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
            chosenCoursesIds={chosenCoursesIds}
            onCheck={onCheck}
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
  chosenCoursesIds?: string[],   // Used to take/untake courses
  onCheck?: (courseId: string, checked: boolean) => void
}

const CategoryEntry = (props: CategoryEntryProps) => {
  const { category, programmeId, major, minor, courses, updateCourse, removeCourse, coursesIdsToShow, chosenCoursesIds, onCheck } = props;

  const { isOpen, onToggle, onOpen } = useDisclosure();

  useEffect(onOpen, []);

  const { categoriesData } = useCategoriesData(programmeId);

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

  return (
    <Stack fontSize={{ base: "15px", lg: "" }}>
      <Text fontWeight="semibold" onClick={onToggle} _hover={{ cursor: "pointer" }}>
        {title}
      </Text>

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
                chosenCoursesIds={chosenCoursesIds}
                onCheck={onCheck}
              />
            ) : (
              // Grouped by season
              <CoursesSeasonList
                courses={courses}
                programmeId={programmeId}
                updateCourse={updateCourse}
                removeCourse={removeCourse}
                coursesIdsToShow={coursesIdsToShow}
                chosenCoursesIds={chosenCoursesIds}
                onCheck={onCheck}
              />
            )}
          </Stack>
        </Box>
      )}
    </Stack>
  )
}

export default CoursesCategoryList;