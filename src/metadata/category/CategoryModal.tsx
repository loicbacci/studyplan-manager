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
  Stack,
  useToast
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { FiTrash } from "react-icons/fi";
import { addCategory, deleteCategory, updateCategory } from "../../firebase/categories";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
}

function CategoryModal(props: CategoryModalProps) {
  const { category, isOpen, onClose } = props;
  const toast = useToast();

  const onSubmit = (name: string, minCredits?: number, notes?: string) => {
    if (category) {
      // EDIT
      updateCategory(category.id, name, minCredits, notes)
        .then(() =>
          toast({
            title: "Successfully edited category",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() =>
          toast({
            title: "Failed to edit category",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        );
    } else {
      // ADD
      addCategory(name, minCredits, notes)
        .then(() =>
          toast({
            title: "Successfully added category",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() => {
          toast({
            title: "Failed to add category",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }

    onClose();
  };

  const onDelete = () => {
    if (category) {
      deleteCategory(category.id)
        .then(() =>
          toast({
            title: "Successfully deleted category",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() => {
          toast({
            title: "Failed to delete category",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
    
    onClose();
  }

  const validateName = (value: string) => {
    return !value ? "Name is required" : "";
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{category ? "Edit " : "Add "} Category</ModalHeader>

        <Formik
          initialValues={{
            name: category ? category.name : "",
            minCredits: category ? category.min_credits : undefined,
            notes: category ? category.notes : undefined
          }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              onSubmit(values.name, values.minCredits, values.notes);
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
                        <Input {...field} placeholder="Enter name" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  
                  <Field name="minCredits">
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>Minimum credits</FormLabel>
                        <NumberInput
                          {...field}
                          min={0}
                          onChange={val => form.setFieldValue(field.name, val)}
                        >
                          <NumberInputField placeholder="Minimum number of credits"/>
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="notes">
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>Notes</FormLabel>
                        <Input {...field} placeholder="Enter notes" />
                      </FormControl>
                    )}
                  </Field>
                </Stack>
              </ModalBody>

              <ModalFooter>
                <HStack spacing={3}>
                  <Button onClick={onClose}>
                    Close
                  </Button>
                  {category && (
                    <IconButton colorScheme="red" aria-label="delete" icon={<FiTrash/>} onClick={onDelete} />
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

export default CategoryModal;
