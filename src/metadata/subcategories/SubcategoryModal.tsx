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
  Stack,
  useToast
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { FiTrash } from "react-icons/fi";
import { addSubCategory, updateSubCategory, deleteSubCategory } from "../../firebase/subCategories";

interface SubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subCategory?: SubCategory;
  categories: Category[]
}

const SubCategoryModal = (props: SubCategoryModalProps) => {
  const { subCategory, isOpen, onClose, categories } = props;
  const toast = useToast();

  const onSubmit = (name: string, parentId: string, minCredits?: number, notes?: string) => {
    if (subCategory) {
      // EDIT
      updateSubCategory(subCategory.id, name, parentId, minCredits, notes)
        .then(() =>
          toast({
            title: "Successfully edited sub-category",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() =>
          toast({
            title: "Failed to edit sub-category",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        );
    } else {
      // ADD
      addSubCategory(name, parentId, minCredits, notes)
        .then(() =>
          toast({
            title: "Successfully added sub-category",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch((err) => {
          console.error(err);
          toast({
            title: "Failed to add sub-category",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }

    onClose();
  };

  const onDelete = () => {
    if (subCategory) {
      deleteSubCategory(subCategory.id)
        .then(() =>
          toast({
            title: "Successfully deleted sub-category",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() => {
          toast({
            title: "Failed to delete sub-category",
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

  const validateParentId = (value: string) => {
    if (!value) return "Parent ID is required";
    if (value === "Enter parent ID") return "Choose a Parent ID";
    return "";
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{subCategory ? "Edit " : "Add "} Sub-Category</ModalHeader>

        <Formik
          initialValues={{
            name: subCategory ? subCategory.name : "",
            parentId: subCategory ? subCategory.parentId : "",
            minCredits: subCategory ? subCategory.min_credits : undefined,
            notes: subCategory ? subCategory.notes : undefined
          }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              onSubmit(values.name, values.parentId, values.minCredits, values.notes);
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

                  <Field as="select" name="parentId" validate={validateParentId}>
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.parentId && form.touched.parentId}
                        isRequired
                      >
                        <FormLabel>Parent ID</FormLabel>
                        <Select {...field} placeholder="Enter parent ID">
                          {categories.map(cat => (
                            <option value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{form.errors.parentId}</FormErrorMessage>
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
                  {subCategory && (
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

export default SubCategoryModal;
