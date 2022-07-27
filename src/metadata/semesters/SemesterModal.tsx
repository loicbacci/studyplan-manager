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
  Stack,
  useToast
} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import {FiTrash} from "react-icons/fi";
import {addSemester, deleteSemester, updateSemester} from "../../firebase/semesters";

interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  semester?: Semester;
}

const SemesterModal = (props: SemesterModalProps) => {
  const {semester, isOpen, onClose} = props;
  const toast = useToast();

  const onSubmit = (name: string) => {
    if (semester) {
      // EDIT
      updateSemester(semester.id, name)
        .then(() =>
          toast({
            title: "Successfully edited semester",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() =>
          toast({
            title: "Failed to edit semester",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        );
    } else {
      // ADD
      addSemester(name)
        .then(() =>
          toast({
            title: "Successfully added semester",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() => {
          toast({
            title: "Failed to add semester",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }

    onClose();
  };

  const onDelete = () => {
    if (semester) {
      deleteSemester(semester.id)
        .then(() =>
          toast({
            title: "Successfully deleted semester",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() => {
          toast({
            title: "Failed to delete semester",
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
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>{semester ? "Edit " : "Add "} Semester</ModalHeader>

        <Formik
          initialValues={{
            name: semester ? semester.name : ""
          }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              onSubmit(values.name);
              actions.setSubmitting(false);
            }, 500);
          }}
        >
          {(props) => (
            <Form>
              <ModalBody>
                <Stack spacing={4}>
                  <Field name="name" validate={validateName}>
                    {({field, form}: any) => (
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
                </Stack>
              </ModalBody>

              <ModalFooter>
                <HStack spacing={3}>
                  <Button onClick={onClose}>
                    Close
                  </Button>
                  {semester && (
                    <IconButton colorScheme="red" aria-label="delete" icon={<FiTrash/>} onClick={onDelete}/>
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

export default SemesterModal;
