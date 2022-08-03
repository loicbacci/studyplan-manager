import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
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
  NumberInputStepper, Radio, RadioGroup,
  Select,
  Stack, Textarea
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";
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
  const { headerTitle, alertTitle, fields, onSubmit, onDelete, isOpen, onClose } = props;

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
                    if (f.isRadio) {
                      // RADIO
                      if (typeof f.initialValue === "string" || f.undefinedType === "string") {
                        return (
                          <Field name={f.name} validate={f.validate}>
                            {({ field, form }: any) => (
                              <FormControl
                                id={f.name}
                                isInvalid={form.errors[f.name] && form.touched[f.name]}
                                isRequired={f.isRequired}
                              >
                                <FormLabel htmlFor={f.name}>
                                  {f.label}
                                </FormLabel>
                                <RadioGroup {...field} id={f.name}>
                                  <Stack direction='row'>
                                    {f.possibleValues && f.possibleValues.map(val => (
                                      <Radio {...field} value={val}>
                                        {val}
                                      </Radio>
                                    ))}
                                  </Stack>
                                </RadioGroup>
                                <FormErrorMessage>{form.errors[f.name]}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        )
                      }
                    }
                    if (f.possibleValues) {
                      // SELECT
                      if (typeof f.initialValue === "string" || f.undefinedType === "string") {
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
                                  {f.possibleValues && f.possibleValues.map((val, i) => (
                                    <option value={val}>
                                      {f.possibleValuesLabels ? f.possibleValuesLabels[i] : val}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage>{form.errors[f.name]}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        )
                      }
                    }

                    if (typeof f.initialValue === "string" || f.undefinedType === "string") {
                      return (
                        <Field name={f.name} validate={f.validate}>
                          {({ field, form }: any) => (
                            <FormControl
                              isInvalid={form.errors[f.name] && form.touched[f.name]}
                              isRequired={f.isRequired}
                            >
                              <FormLabel>{f.label}</FormLabel>
                              {f.textArea ? (
                                <Textarea {...field} placeholder={f.placeholder} />
                              ) : (
                                <Input {...field} placeholder={f.placeholder}/>
                              )}
                              <FormErrorMessage>{form.errors[f.name]}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      )
                    }
                    if (typeof f.initialValue === "number" || f.undefinedType === "number") {
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

                    return <div>Unknown field</div>
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
  );
}

export default DataModal;
