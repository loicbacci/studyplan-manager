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
  ModalOverlay, Stack,
  useToast
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { FiTrash } from "react-icons/fi";
import {addMinor, deleteMinor, updateMinor} from "../../firebase/minors";
import {addSeason, deleteSeason} from "../../firebase/seasons";

interface MinorModalProps {
  isOpen: boolean;
  onClose: () => void;
  minor?: Minor;
}

const MinorModal = (props: MinorModalProps) => {
  const { minor, isOpen, onClose } = props;
  const toast = useToast();

  const onSubmit = (name: string) => {
    if (minor) {
      // EDIT
      updateMinor(minor.id, name)
        .then(() =>
          toast({
            title: "Successfully edited minor",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() =>
          toast({
            title: "Failed to edit minor",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        );
    } else {
      // ADD
      addMinor(name)
        .then(() =>
          toast({
            title: "Successfully added minor",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() => {
          toast({
            title: "Failed to add minor",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }

    onClose();
  };

  const onDelete = () => {
    if (minor) {
      deleteMinor(minor.id)
        .then(() =>
          toast({
            title: "Successfully deleted minor",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() => {
          toast({
            title: "Failed to delete minor",
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
        <ModalHeader>{minor ? "Edit " : "Add "} Minor</ModalHeader>

        <Formik
          initialValues={{
            name: minor ? minor.name : ""
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
                </Stack>
              </ModalBody>

              <ModalFooter>
                <HStack spacing={3}>
                  <Button onClick={onClose}>
                    Close
                  </Button>
                  {minor && (
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

export default MinorModal;
