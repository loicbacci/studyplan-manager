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
import { addSeason, deleteSeason, updateSeason } from "../../firebase/seasons";

interface SeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  season?: Season;
}

const SeasonModal = (props: SeasonModalProps) => {
  const { season, isOpen, onClose } = props;
  const toast = useToast();

  const onSubmit = (name: string) => {
    if (season) {
      // EDIT
      updateSeason(season.id, name)
        .then(() =>
          toast({
            title: "Successfully edited season",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() =>
          toast({
            title: "Failed to edit season",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        );
    } else {
      // ADD
      addSeason(name)
        .then(() =>
          toast({
            title: "Successfully added season",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() => {
          toast({
            title: "Failed to add season",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }

    onClose();
  };

  const onDelete = () => {
    if (season) {
      deleteSeason(season.id)
        .then(() =>
          toast({
            title: "Successfully deleted season",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch(() => {
          toast({
            title: "Failed to delete season",
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
        <ModalHeader>{season ? "Edit " : "Add "} Season</ModalHeader>

        <Formik
          initialValues={{
            name: season ? season.name : ""
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
                  {season && (
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

export default SeasonModal;
