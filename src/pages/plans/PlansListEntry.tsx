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
  Select,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import Entry from "../../components/Entry";
import { Link as RLink } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { useMajors } from "../../lib/firestore/majors";
import { useMinors } from "../../lib/firestore/minors";
import DeleteButton from "../../components/DeleteButton";
import { useAppSelector } from "../../redux/hooks";
import { selectProgrammes } from "../../redux/programmesSlice";

interface PlansEntryBaseProps {
  plan?: Plan,
  addPlan?: (
    name: string, programme_id: string, chosen_major_id: string, chosen_minor_id: string, notes?: string) => void,
  updatePlan?: (
    name: string, programme_id: string, chosen_major_id: string, chosen_minor_id: string, notes?: string) => void,
  removePlan?: () => void
}

const PlansListEntryBase = (props: PlansEntryBaseProps) => {
  const { plan, addPlan, updatePlan, removePlan } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const programmes = useAppSelector(selectProgrammes);

  const isEditing = plan !== undefined && updatePlan !== undefined && removePlan !== undefined;
  const isAdding = addPlan !== undefined;

  const onSubmit = (elem: Omit<Plan, "id">) => {
    if (isEditing) {
      // EDIT
      updatePlan(elem.name, elem.programme_id, elem.chosen_major_id, elem.chosen_minor_id, elem.notes);

    } else if (isAdding) {
      // ADD
      addPlan(elem.name, elem.programme_id, elem.chosen_major_id, elem.chosen_minor_id, elem.notes);
    }

    onClose();
  }

  const onDelete = () => {
    if (isEditing) {
      removePlan();
    }

    onClose();
  }

  const validateName = (v: string) => v === "" ? "Please enter name" : "";

  const programmeIdPlaceholder = "Enter programme"
  const validateProgrammeId = (v: string) => (v === "" || v === programmeIdPlaceholder) ? "Please enter programme" : "";

  return (
    <>
      {isEditing ? (
        <Entry
          left={
            <Stack spacing={0}>
              <Link as={RLink} to={`/plans/${plan.id}`}>
                {plan.name}
              </Link>
              {plan.notes && <Text color="gray">{plan.notes}</Text>}
            </Stack>

          }
          onClick={onOpen}
          border
        />

      ) : (
        <Button onClick={onOpen} w="40">
          Add plan
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            <Text>
              {isEditing ? "Edit" : "Add"} Plan
            </Text>
          </ModalHeader>

          <Formik
            initialValues={{
              name: plan ? plan.name : "",
              programme_id: plan ? plan.programme_id : "",
              chosen_major_id: plan ? plan.chosen_major_id : "",
              chosen_minor_id: plan ? plan.chosen_minor_id : "",
              notes: plan ? plan.notes : undefined
            }}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                onSubmit(values as unknown as Omit<Plan, "id">);
                actions.setSubmitting(false);
              }, 500);
            }}
          >
            {(props) => (
              <Form>
                <ModalBody>
                  <Stack spacing={4}>
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

                    <Field name="notes">
                      {({ field }: any) => (
                        <FormControl>
                          <FormLabel>Notes</FormLabel>
                          <Input {...field} placeholder="Enter notes"/>
                        </FormControl>
                      )}
                    </Field>

                    <Field as="select" name="programme_id" validate={validateProgrammeId}>
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={form.errors.programme_id && form.touched.programme_id}
                          isRequired
                        >
                          <FormLabel>Programme</FormLabel>
                          <Select {...field} placeholder={programmeIdPlaceholder}>
                            {programmes.map(programme => (
                              <option value={programme.id}>
                                {programme.name}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>{form.errors.programme_id}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    {validateProgrammeId(props.values.programme_id) === "" && (
                      <ProgrammeFields programmeId={props.values.programme_id}/>
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
                        alertTitle={<Text>Delete Plan</Text>}
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

interface ProgrammeFieldsProps {
  programmeId: string
}

const ProgrammeFields = (props: ProgrammeFieldsProps) => {
  const { programmeId } = props;

  const { majors } = useMajors(programmeId);
  const { minors } = useMinors(programmeId);

  const majorIdPlaceholder = "Enter major"
  const validateMajorId = (v: string) => (v === "" || v === majorIdPlaceholder) ? "Please enter major" : "";

  const minorIdPlaceholder = "Enter minor"
  const validateMinorId = (v: string) => (v === "" || v === minorIdPlaceholder) ? "Please enter minor" : "";

  return (
    <>
      {majors && (
        <Field as="select" name="chosen_major_id" validate={validateMajorId}>
          {({ field, form }: any) => (
            <FormControl
              isInvalid={form.errors.chosen_major_id && form.touched.chosen_major_id}
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
              <FormErrorMessage>{form.errors.chosen_major_id}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      )}

      {minors && (
        <Field as="select" name="chosen_minor_id" validate={validateMinorId}>
          {({ field, form }: any) => (
            <FormControl
              isInvalid={form.errors.chosen_minor_id && form.touched.chosen_minor_id}
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
              <FormErrorMessage>{form.errors.chosen_minor_id}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      )}
    </>

  )
}


interface PlansListEntryProps {
  plan: Plan,
  updatePlan: (
    name: string, programme_id: string, chosen_major_id: string, chosen_minor_id: string, notes?: string) => void,
  removePlan: () => void,
}

export const PlansListEntry = (props: PlansListEntryProps) => {
  return (
    <PlansListEntryBase {...props}/>
  )
}

interface AddPlanButtonProps {
  addPlan: (
    name: string, programme_id: string, chosen_major_id: string, chosen_minor_id: string, notes?: string) => void,
}

export const AddPlanButton = (props: AddPlanButtonProps) => {
  return (
    <PlansListEntryBase {...props}/>
  )
}
