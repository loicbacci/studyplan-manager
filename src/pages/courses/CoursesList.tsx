import React, { useEffect } from "react";
import { Box, Heading, HStack, IconButton, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddCourseButton, CoursesListEntry } from "./CoursesListEntry";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useCategoriesData } from "../../lib/firestore/categories";
import { useCourses } from "../../lib/firestore/courses";
import { useSeasons } from "../../lib/firestore/seasons";

type CoursesBySeason = Course[]

interface CoursesListProps {
  programmeId: string
}

const CoursesList = (props: CoursesListProps) => {
  const { programmeId } = props;
  const { isOpen, onToggle } = useDisclosure();

  const { courses, add, update, remove } = useCourses(programmeId);
  const sortedCourses = courses ? courses.sort((a, b) => a.school_course_id.localeCompare(b.school_course_id)) : [];

  const { categoriesData } = useCategoriesData(programmeId);
  const categories = categoriesData ? categoriesData.map(cd => cd.category) : [];

  const { seasons } = useSeasons(programmeId);

  const toast = useToast();

  const addCourse = (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string
  ) => {
    add({
          school_course_id,
          name,
          link,
          credits,
          season_id,
          category_id,
          subcategory_id
        })
      .then(() => toast(toastSuccessOptions("Successfully added course")))
      .catch(() => toast(toastErrorOptions("Failed to add major")));
  }

  const updateCourse = (courseId: string) => (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string
  ) => {
    update({
             id: courseId,
             school_course_id,
             name,
             link,
             credits,
             season_id,
             category_id,
             subcategory_id
           })
      .then(() => toast(toastSuccessOptions("Successfully edited course")))
      .catch(() => toast(toastErrorOptions("Failed to edit course")));
  }

  const removeCourse = (courseId: string) => () => {
    remove(courseId)
      .then(() => toast(toastSuccessOptions("Successfully removed course")))
      .catch(() => toast(toastErrorOptions("Failed to remove course")));
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

    return [...res.entries()].sort((a, b) => a[0].name.localeCompare(b[0].name));
  }

  const groupByCategory = (cs: Course[]) => {
    const res = new Map<Category, Course[]>();

    cs.forEach(course => {
      const category = categories.find(c => c.id === course.category_id);
      if (!category) return;

      if (res.has(category)) {
        res.get(category)?.push(course);
      } else {
        res.set(category, [course]);
      }
    })

    return [...res.entries()].sort((a, b) => a[0].name.localeCompare(b[0].name));
  }

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

    return [...res.entries()].sort((a, b) => a[0].name.localeCompare(b[0].name));
  }

  useEffect(() => {
    if (!courses) return;
    console.log(groupBySeason(courses));
  }, [courses]);

  const Body = (
    <>
      {(courses && courses.length === 0) && <Text color="gray">No courses yet</Text>}
      <Stack>
        {/* Group first by category */}
        {(courses && categoriesData && seasons) && groupByCategory(courses).map(([category, coursesCs]) => {
          const subCategories = getSubCategories(category.id);
          const hasSubcategories = subCategories !== null;


          return (
            <Stack fontSize={{ base: "15px", lg: ""}}>
              <Text fontWeight="semibold">{category.name}</Text>

              <Box pl={{ base: 0.5, lg: 2 }}>
                <Stack borderLeft={{ base: "", lg: "1px" }} borderColor="gray" pl={{ base: 0.5, lg: 4 }}>
                  {hasSubcategories ? (
                    // Grouped by subcategory
                    groupBySubCategory(coursesCs, category.id).map(([subCategory, coursesSCs]) => (
                      <>
                        <Text fontWeight="semibold">{subCategory.name}</Text>

                        {groupBySeason(coursesSCs).map(([season, coursesSs]) => (
                          <Box pl={{ base: 0.5, lg: 2 }}>
                            <Stack borderLeft={{ base: "", lg: "1px" }} borderColor="gray" pl={{ base: 0.5, lg: 4 }}>
                              <Text fontWeight="semibold">{season.name}</Text>

                              <Box pl={{ base: 0.5, lg: 2 }}>
                                <Stack borderLeft={{ base: "", lg: "1px" }} borderColor="gray" pl={{ base: 0.5, lg: 4 }} spacing={0}>
                                  {coursesSs.map(course => (
                                    <CoursesListEntry
                                      seasons={seasons}
                                      categoriesData={categoriesData}
                                      course={course}
                                      updateCourse={updateCourse(course.id)}
                                      removeCourse={removeCourse(course.id)}
                                      key={course.id}
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            </Stack>
                          </Box>

                        ))}
                      </>
                    ))
                  ) : (
                    // Grouped by season
                    groupBySeason(coursesCs).map(([season, coursesSs]) => (
                      <>
                        <Text fontWeight="semibold">{season.name}</Text>

                        <Box pl={{ base: 0.5, lg: 2 }}>
                          <Stack borderLeft={{ base: "", lg: "1px" }} borderColor="gray" pl={{ base: 0.5, lg: 4 }} spacing={0}>
                            {coursesSs.map(course => (
                              <CoursesListEntry
                                seasons={seasons}
                                categoriesData={categoriesData}
                                course={course}
                                updateCourse={updateCourse(course.id)}
                                removeCourse={removeCourse(course.id)}
                                key={course.id}
                              />
                            ))}
                          </Stack>
                        </Box>
                      </>

                    ))
                  )}
                </Stack>
              </Box>
            </Stack>
          )
        })}
        {/*(courses && categoriesData && seasons) && groupBySeason(sortedCourses).map(([season, coursesS]) => (
         <Stack>
         <Text fontWeight="semibold">{season.name}</Text>

         <Box pl={{ base: 0.5, lg: 2 }}>
         <Box borderLeft="1px" pl={{ base: 0.5, lg: 4 }}>
         {groupByCategory(coursesS).map(([category, coursesC]) => {
         const subCategories = getSubCategories(category.id);

         return (
         <Stack>
         <Text fontWeight="semibold" pl={{ base: 1, lg: 0 }}>{category.name}</Text>

         <Box pl={{ base: 0.5, lg: 2 }}>
         <Box borderLeft="1px" pl={{ base: 0.5, lg: 4 }}>
         {subCategories ? (
         groupBySubCategory(coursesC, category.id).map(([subcategory, coursesSC]) => (
         <Stack>
         <Text fontWeight="semibold" pl={{ base: 1, lg: 0 }}>{subcategory.name}</Text>

         <Box pl={{ base: 0.5, lg: 2 }}>
         <Stack borderLeft="1px" pl={{ base: 0.5, lg: 4 }} spacing={0}>
         {coursesSC.map(course => (
         <CoursesListEntry
         seasons={seasons}
         categoriesData={categoriesData}
         course={course}
         updateCourse={updateCourse(course.id)}
         removeCourse={removeCourse(course.id)}
         key={course.id}
         />
         ))}
         </Stack>
         </Box>


         </Stack>
         ))
         ) : (
         <Stack spacing={0}>
         {coursesC.map(course => (
         <CoursesListEntry
         seasons={seasons}
         categoriesData={categoriesData}
         course={course}
         updateCourse={updateCourse(course.id)}
         removeCourse={removeCourse(course.id)}
         key={course.id}
         />
         ))}
         </Stack>

         )}
         </Box>
         </Box>




         </Stack>
         )
         })}
         </Box>
         </Box>


         </Stack>
         ))*/}
      </Stack>

      {(categoriesData && seasons) && (
        <AddCourseButton seasons={seasons} categoriesData={categoriesData} addCourse={addCourse}/>
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