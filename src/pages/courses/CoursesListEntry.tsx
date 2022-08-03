import React from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import Entry from "../../components/Entry";
import { Field, Form, Formik } from "formik";
import DeleteButton from "../../components/DeleteButton";
import { useMajors } from "../../lib/firestore/majors";
import { useMinors } from "../../lib/firestore/minors";
import { useCategoriesData } from "../../lib/firestore/categories";
import { useSeasons } from "../../lib/firestore/seasons";
import { sortByIndex } from "../../lib/utils";


interface CoursesListEntryBaseProps {
  programmeId: string,
  course?: Course,
  addCourse?: (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string, major_id?: string, minor_id?: string
  ) => void,
  updateCourse?: (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string, major_id?: string, minor_id?: string
  ) => void,
  removeCourse?: () => void,

  isChecked?: boolean
  onCheck?: (checked: boolean) => void
}

const CoursesListEntryBase = (props: CoursesListEntryBaseProps) => {
  const { programmeId, course, addCourse, updateCourse, removeCourse, isChecked, onCheck } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { majors } = useMajors(programmeId);
  const { minors } = useMinors(programmeId);
  const { categoriesData } = useCategoriesData(programmeId);
  const { seasons } = useSeasons(programmeId);

  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const isEditing = course !== undefined && updateCourse !== undefined && removeCourse !== undefined;
  const isAdding = addCourse !== undefined;

  const validateID = (v: string) => {
    return v === "" ? "Please enter course ID" : "";
  }

  const validateName = (v: string) => {
    return v === "" ? "Please enter name" : "";
  }

  const validateLink = (v: string) => {
    return v === "" ? "Please enter URL" : "";
  }

  const validateCredits = (v: number | undefined) => {
    return v === undefined ? "Please enter credits" : "";
  }

  const categoryIdPlaceholder = "Enter category";

  const validateCategoryId = (v: string) => {
    return (v === "" || v === categoryIdPlaceholder) ? "Please enter category" : "";
  }

  // Seasons
  const seasonIdPlaceholder = "Enter season";

  const validateSeasonId = (v: string) => {
    return (v === "" || v === seasonIdPlaceholder) ? "Please enter season" : "";
  }

  // Subcategories
  const hasSubCategories = (categoryId: string) => {
    if (!categoriesData) return false;
    const categoryData = categoriesData.find(cd => cd.category.id === categoryId);
    if (!categoryData) return false;

    return categoryData.subCategories !== undefined;
  }

  const getSubCategories = (categoryId: string) => {
    if (!categoriesData) return [];
    const categoryData = categoriesData.find(cd => cd.category.id === categoryId) as CategoryData;
    return categoryData.subCategories as SubCategory[];
  }

  const subcategoryIdPlaceholder = "Enter subcategory";

  const validateSubCategoryId = (v: string) => {
    return (v === "" || v === subcategoryIdPlaceholder) ? "Please enter subcategory" : "";
  }

  // Minor
  const isMinor = (categoryId: string) => {
    if (!categoriesData) return false;
    const categoryData = categoriesData.find(cd => cd.category.id === categoryId);
    if (!categoryData) return false;
    return categoryData.category.is_minor;
  }

  const minorIdPlaceholder = "Enter minor";

  const validateMinorId = (v: string) => {
    return (v === "" || v === minorIdPlaceholder) ? "Please enter minor" : "";
  }

  // Major
  const isMajor = (categoryId: string) => {
    if (!categoriesData) return false;
    const categoryData = categoriesData.find(cd => cd.category.id === categoryId);
    if (!categoryData) return false;
    return categoryData.category.is_major;
  }

  const majorIdPlaceholder = "Enter major";

  const validateMajorId = (v: string) => {
    return (v === "" || v === majorIdPlaceholder) ? "Please enter major" : "";
  }

  const onSubmit = (elem: Omit<Course, "id">) => {
    if (!hasSubCategories(elem.category_id)) {
      elem.subcategory_id = undefined;
    }

    if (!isMinor(elem.category_id)) {
      elem.minor_id = undefined;
    }

    if (!isMinor(elem.category_id)) {
      elem.major_id = undefined;
    }

    if (isEditing) {
      // EDI
      updateCourse(
        elem.school_course_id, elem.name, elem.link, elem.credits, elem.season_id, elem.category_id,
        elem.subcategory_id, elem.major_id, elem.minor_id
      );
    } else if (isAdding) {
      // ADD
      addCourse(
        elem.school_course_id, elem.name, elem.link, elem.credits, elem.season_id, elem.category_id,
        elem.subcategory_id, elem.major_id, elem.minor_id
      );
    }

    onClose();
  }

  const onDelete = () => {
    if (isEditing) {
      removeCourse();
    }

    onClose();
  }

  return (
    <>
      {isEditing ? (
        <Entry
          left={
            <HStack spacing={2}>
              {isDesktop && <Text color="gray">{course.school_course_id}</Text>}
              {isDesktop && <Text>-</Text>}
              <Stack spacing={0}>
                <Link href={course.link} isExternal color="blue.500">{course.name}</Link>
                {!isDesktop && <Text color="gray">{course.credits} credits</Text>}
              </Stack>

            </HStack>
          }
          right={isDesktop && <Text>{course.credits} credits</Text>}
          onClick={onOpen}
          isChecked={isChecked}
          onCheck={onCheck}
          iconSize="sm"
        />
      ) : (
        <Button onClick={onOpen} w="fit-content" size="sm">
          Add course
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader><Text>{isEditing ? "Edit" : "Add"} Course</Text></ModalHeader>

          <Formik
            initialValues={{
              school_course_id: course ? course.school_course_id : "",
              name: course ? course.name : "",
              link: course ? course.link : "",
              credits: course ? course.credits : undefined,
              season_id: course ? course.season_id : "",
              category_id: course ? course.category_id : "",
              subcategory_id: course ? course.subcategory_id : undefined,
              major_id: course ? course.major_id : undefined,
              minor_id: course ? course.minor_id : undefined,
            }}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                onSubmit(values as unknown as Omit<Course, "id">);
                actions.setSubmitting(false);
              }, 500);
            }}
          >
            {(props) => (
              <Form>
                <ModalBody>
                  <Stack spacing={4}>
                    <Field name="school_course_id" validate={validateID}>
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={form.errors.school_course_id && form.touched.school_course_id}
                          isRequired
                        >
                          <FormLabel>Course ID</FormLabel>
                          <Input {...field} placeholder="Enter course ID"/>
                          <FormErrorMessage>{form.errors.school_course_id}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="name" validate={validateName}>
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={form.errors.name && form.touched.name}
                          isRequired
                        >
                          <FormLabel>Name</FormLabel>
                          <Input {...field} placeholder="Enter name"/>
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="link" validate={validateLink}>
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={form.errors.link && form.touched.link}
                          isRequired
                        >
                          <FormLabel>Course URL</FormLabel>
                          <Input {...field} placeholder="Enter course URL" type="url"/>
                          <FormErrorMessage>{form.errors.link}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="credits" validate={validateCredits}>
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={form.errors.credits && form.touched.credits}
                          isRequired
                        >
                          <FormLabel>Course credits</FormLabel>
                          <NumberInput
                            {...field}
                            min={0}
                            onChange={val => form.setFieldValue(field.name, val)}
                          >
                            <NumberInputField placeholder="Enter credits"/>
                            <NumberInputStepper>
                              <NumberIncrementStepper/>
                              <NumberDecrementStepper/>
                            </NumberInputStepper>
                          </NumberInput>
                          <FormErrorMessage>{form.errors.credits}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    {seasons && (
                      <Field as="select" name="season_id" validate={validateSeasonId}>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={form.errors.season_id && form.touched.season_id}
                            isRequired
                          >
                            <FormLabel>Season</FormLabel>
                            <Select {...field} placeholder={seasonIdPlaceholder}>
                              {seasons.map(season => (
                                <option value={season.id}>
                                  {season.name}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{form.errors.season_id}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    )}

                    {categoriesData && (
                      <Field as="select" name="category_id" validate={validateCategoryId}>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={form.errors.category_id && form.touched.category_id}
                            isRequired
                          >
                            <FormLabel>Category</FormLabel>
                            <Select {...field} placeholder={categoryIdPlaceholder}>
                              {categoriesData.map(cd => cd.category).sort(sortByIndex).map(cat => (
                                <option value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{form.errors.category_id}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    )}

                    {hasSubCategories(props.values.category_id) && (
                      <Field as="select" name="subcategory_id" validate={validateSubCategoryId}>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={form.errors.subcategory_id && form.touched.subcategory_id}
                            isRequired
                          >
                            <FormLabel>Sub Category</FormLabel>
                            <Select {...field} placeholder={subcategoryIdPlaceholder}>
                              {getSubCategories(props.values.category_id).sort(sortByIndex).map(subcat => (
                                <option value={subcat.id}>
                                  {subcat.name}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{form.errors.subcategory_id}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    )}

                    {(isMajor(props.values.category_id) && majors) && (
                      <Field as="select" name="major_id" validate={validateMajorId}>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={form.errors.major_id && form.touched.major_id}
                            isRequired
                          >
                            <FormLabel>Major</FormLabel>
                            <Select {...field} placeholder={majorIdPlaceholder}>
                              {majors.map(major => (
                                <option value={major.id}>
                                  {major.name}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{form.errors.major_id}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    )}

                    {(isMinor(props.values.category_id) && minors) && (
                      <Field as="select" name="minor_id" validate={validateMinorId}>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={form.errors.minor_id && form.touched.minor_id}
                            isRequired
                          >
                            <FormLabel>Minor</FormLabel>
                            <Select {...field} placeholder={minorIdPlaceholder}>
                              {minors.map(minor => (
                                <option value={minor.id}>
                                  {minor.name}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{form.errors.minor_id}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    )}
                  </Stack>
                </ModalBody>

                <ModalFooter>
                  <HStack spacing={3}>
                    <Button onClick={onClose}>
                      Close
                    </Button>
                    {(isEditing ? onDelete : undefined) && (
                      <DeleteButton
                        alertTitle={<Text>Delete Course</Text>}
                        onCancel={() => {
                        }}
                        onDelete={onDelete}
                      />
                    )}
                    <Button
                      colorScheme="teal"
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Save
                    </Button>
                  </HStack>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>

  )
}

interface CoursesListEntryProps {
  programmeId: string,
  course: Course,
  updateCourse: (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string, major_id?: string, minor_id?: string
  ) => void,
  removeCourse: () => void,

  isChecked?: boolean
  onCheck?: (checked: boolean) => void
}

export const CoursesListEntry = (props: CoursesListEntryProps) => {
  return (
    <CoursesListEntryBase {...props}/>
  )
}

interface AddCourseButtonProps {
  programmeId: string,
  addCourse: (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string, major_id?: string, minor_id?: string
  ) => void,
}

export const AddCourseButton = (props: AddCourseButtonProps) => {
  return (
    <CoursesListEntryBase {...props}/>
  )
}
