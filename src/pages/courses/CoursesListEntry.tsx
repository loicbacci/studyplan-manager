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
  Text, useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import Entry from "../../components/Entry";
import { Field, Form, Formik } from "formik";
import DeleteButton from "../../components/DeleteButton";


interface CoursesListEntryBaseProps {
  categoriesData: CategoryData[],
  seasons: Season[],
  course?: Course,
  addCourse?: (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string
  ) => void,
  updateCourse?: (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string
  ) => void,
  removeCourse?: () => void
}

const CoursesListEntryBase = (props: CoursesListEntryBaseProps) => {
  const { categoriesData, seasons, course, addCourse, updateCourse, removeCourse } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const subcategoryIdPlaceholder = "Enter subcategory";

  const validateSubCategoryId = (v: string) => {
    return (v === "" || v === subcategoryIdPlaceholder) ? "Please enter subcategory" : "";
  }

  const seasonIdPlaceholder = "Enter season";

  const validateSeasonId = (v: string) => {
    return (v === "" || v === seasonIdPlaceholder) ? "Please enter season" : "";
  }

  const hasSubCategories = (categoryId: string) => {
    const categoryData = categoriesData.find(cd => cd.category.id === categoryId);
    if (!categoryData) return false;

    return categoryData.subCategories !== undefined;
  }

  const getSubCategories = (categoryId: string) => {
    const categoryData = categoriesData.find(cd => cd.category.id === categoryId) as CategoryData;
    return categoryData.subCategories as SubCategory[];
  }

  const onSubmit = (elem: Omit<Course, "id">) => {
    if (!hasSubCategories(elem.category_id)) {
      elem.subcategory_id = undefined;
    }

    if (isEditing) {
      // EDI
      updateCourse(
        elem.school_course_id, elem.name, elem.link, elem.credits, elem.season_id, elem.category_id,
        elem.subcategory_id
      );
    } else if (isAdding) {
      // ADD
      addCourse(
        elem.school_course_id, elem.name, elem.link, elem.credits, elem.season_id, elem.category_id,
        elem.subcategory_id
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

  //TODO add to major categories, the selection of the major (and same for minors)

  return (
    <>
      {isEditing ? (
        <Entry
          left={
            <HStack spacing={2}>
              {isDesktop && <Text color="gray">{course.school_course_id}</Text>}
              {isDesktop && <Text>-</Text>}
              <Link href={course.link} isExternal color="blue.500">{course.name}</Link>
            </HStack>
          }
          right={<Text>{course.credits} credits</Text>}
          onEdit={onOpen}
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
              subcategory_id: course ? course.subcategory_id : undefined
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

                    <Field as="select" name="category_id" validate={validateCategoryId}>
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={form.errors.category_id && form.touched.category_id}
                          isRequired
                        >
                          <FormLabel>Category</FormLabel>
                          <Select {...field} placeholder={categoryIdPlaceholder}>
                            {categoriesData.map(cat => (
                              <option value={cat.category.id}>
                                {cat.category.name}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>{form.errors.category_id}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    {hasSubCategories(props.values.category_id) && (
                      <Field as="select" name="subcategory_id" validate={validateSubCategoryId}>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={form.errors.subcategory_id && form.touched.subcategory_id}
                            isRequired
                          >
                            <FormLabel>Sub Category</FormLabel>
                            <Select {...field} placeholder={subcategoryIdPlaceholder}>
                              {getSubCategories(props.values.category_id).map(subcat => (
                                <option value={subcat.id}>
                                  {subcat.name}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{form.errors.subcategory_id}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    )
                    }
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
  seasons: Season[],
  categoriesData: CategoryData[],
  course: Course,
  updateCourse: (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string
  ) => void,
  removeCourse: () => void
}

export const CoursesListEntry = (props: CoursesListEntryProps) => {
  return (
    <CoursesListEntryBase {...props}/>
  )
}

interface AddCourseButtonProps {
  seasons: Season[],
  categoriesData: CategoryData[],
  addCourse: (
    school_course_id: string, name: string, link: string, credits: number, season_id: string, category_id: string,
    subcategory_id?: string
  ) => void,
}

export const AddCourseButton = (props: AddCourseButtonProps) => {
  return (
    <CoursesListEntryBase {...props}/>
  )
}
