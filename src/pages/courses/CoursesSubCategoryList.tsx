import React, { useEffect } from "react";
import { Box, LinkBox, LinkOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react";
import CoursesSeasonList from "./CoursesSeasonList";
import { sortByIndex } from "../../lib/utils";
import { useCategoriesData } from "../../lib/firestore/categories";
import { RemoveCourse, UpdateCourse } from "./CoursesList";

interface CoursesSubCategoryListProps {
  courses: Course[],
  programmeId: string,
  categoryId: string,
  updateCourse: UpdateCourse,
  removeCourse: RemoveCourse
}

const CoursesSubCategoryList = (props: CoursesSubCategoryListProps) => {
  const { programmeId, categoryId, courses, updateCourse, removeCourse } = props;

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
  removeCourse: RemoveCourse
}

const SubCategoryEntry = (props: SubCategoryEntryProps) => {
  const { subCategory, courses, programmeId, updateCourse, removeCourse } = props;

  const { isOpen, onToggle, onOpen } = useDisclosure();

  useEffect(onOpen, []);

  return (
    <>
      <Text fontWeight="semibold" onClick={onToggle} _hover={{ cursor: "pointer" }}>
        {subCategory.name}
      </Text>


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
          />
        </Stack>
      </Box>}
    </>
  )
}

export default CoursesSubCategoryList;