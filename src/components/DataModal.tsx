import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
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
  Stack
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { FiTrash } from "react-icons/fi";
import { ReactNode } from "react";
import DeleteButton from "./DeleteButton";

interface DataModalProps<T> {
  headerTitle: ReactNode
  alertTitle: ReactNode

  // fields
  fields: MyField<any>[]

  // submits
  onSubmit: (elem: Omit<T, "id">) => void
  onDelete?: () => void

  // modal elems
  isOpen: boolean
  onClose: () => void
}

function DataModal<T>(props: DataModalProps<T>) {
  const {  headerTitle, alertTitle, fields, onSubmit, onDelete, isOpen, onClose } = props;

  const initialValues = fields.reduce((rs, v) => ({ ...rs, [v.name]: v.initialValue }), {})

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>{headerTitle}</ModalHeader>

        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              onSubmit(values as unknown as Omit<T, "id">);
              actions.setSubmitting(false);
            }, 500);
          }}
        >
          {(props) => (
            <Form>
              <ModalBody>
                <Stack spacing={4}>
                  {fields.map(f => {
                    if (f.possibleValues) {
                      // SELECT
                      if (typeof f.initialValue === "string") {
                        // SELECT OF STRINGS
                        return (
                          <Field as="select" name={f.name} validate={f.validate}>
                            {({ field, form }: any) => (
                              <FormControl
                                isInvalid={form.errors[f.name] && form.touched[f.name]}
                                isRequired={f.isRequired}
                              >
                                <FormLabel>{f.label}</FormLabel>
                                <Select {...field} placeholder={f.placeholder}>
                                  {f.possibleValues && f.possibleValues.map(val => (
                                    <option value={val}>
                                      {val}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage>{form.errors.parentId}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        )
                      }
                    }
                    if (typeof f.initialValue === "string") {
                      return (
                        <Field name={f.name} validate={f.validate}>
                          {({ field, form }: any) => (
                            <FormControl
                              isInvalid={form.errors[f.name] && form.touched[f.name]}
                              isRequired={f.isRequired}
                            >
                              <FormLabel>{f.label}</FormLabel>
                              <Input {...field} placeholder={f.placeholder}/>
                              <FormErrorMessage>{form.errors[f.name]}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      )
                    }
                    if (typeof f.initialValue === "number") {
                      return (
                        <Field name={f.name} validate={f.validate}>
                          {({ field, form }: any) => (
                            <FormControl
                              isInvalid={form.errors[f.name] && form.touched[f.name]}
                              isRequired={f.isRequired}
                            >
                              <FormLabel>{f.label}</FormLabel>
                              <NumberInput
                                {...field}
                                min={f.minNumber}
                                max={f.maxNumber}
                                onChange={val => form.setFieldValue(field.name, val)}
                              >
                                <NumberInputField placeholder={f.placeholder}/>
                                <NumberInputStepper>
                                  <NumberIncrementStepper/>
                                  <NumberDecrementStepper/>
                                </NumberInputStepper>
                              </NumberInput>
                              <FormErrorMessage>{form.errors[f.name]}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      )
                    }

                    return <div>oops</div>
                  })}
                </Stack>
              </ModalBody>

              <ModalFooter>
                <HStack spacing={3}>
                  <Button onClick={onClose}>
                    Close
                  </Button>
                  {onDelete && (
                    <DeleteButton
                      alertTitle={alertTitle}
                      onCancel={() => {}}
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
  );
}

export default DataModal;
