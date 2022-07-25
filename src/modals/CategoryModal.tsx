import { Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiEdit } from 'react-icons/fi';
import { addCategory, updateCategory } from "../firebase/categories";

interface CategoryModalProps {
  category?: Category
}

function CategoryModal (props: CategoryModalProps) {
  const { category } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [name, setName] = useState(category ? category.name : '');
  const [isNameError, setIsNameError] = useState(false);
  const [minCredits, setMinCredits] = useState(category && category.min_credits ? category.min_credits.toString() : "");


  useEffect(() => {
    if (!category) return;
    setName(category.name);
  }, [category]);

  const handleClose = () => {
    setName("");
    setIsNameError(false);
    onClose();
  }

  const onSave = () => {
    if (name === '') {
      setIsNameError(true);
      return;
    }

    let parsedMinCredits: number | undefined = undefined;

    if (minCredits !== undefined) {
      const mnCr = Number.parseInt(minCredits);
      if (!isNaN(mnCr)) {
        parsedMinCredits = mnCr;
      }
    }

    if (category) {
      // Edit
      const newCategory: Partial<Category> = { name };

      if (parsedMinCredits) newCategory.min_credits = parsedMinCredits;

      updateCategory(category.id, newCategory)
        .then(() =>
          toast({
            title: "Successfully edited category",
            status: "success",
            duration: 5000,
            isClosable: true
          })
        )
        .catch(() =>
          toast({
            title: "Failed to edit category",
            status: "error",
            duration: 5000,
            isClosable: true
          })
        );
    } else {
      // Add
      addCategory(name)
        .then(() =>
          toast({
            title: "Successfully added category",
            status: "success",
            duration: 5000,
            isClosable: true
          })
        )
        .catch(err => {
          console.error(err);
          toast({
            title: "Failed to add category",
            status: "error",
            duration: 5000,
            isClosable: true
          })
        });
    }

    handleClose();
  }

  return (
    <>
      {category ?
        (
          <Flex>
            <Text>{category.name}</Text>
            
            <Spacer />
            <HStack spacing={4}>
              {category.min_credits && <Text>{category.min_credits} minimum credits</Text>}
              <IconButton aria-label="Edit category" icon={<FiEdit />} onClick={onOpen}/>
            </HStack>
            
          </Flex>
        ) : (
          <Button onClick={onOpen} w="40">
            Add category
          </Button>
        )
      }

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{category ? "Edit " : "Add "} Category</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired isInvalid={isNameError}>
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter name"
                />
                {isNameError && <FormErrorMessage>Name is required</FormErrorMessage>}
              </FormControl>

              <FormControl >
                <FormLabel>Min credits</FormLabel>
                <NumberInput
                  value={minCredits}
                  onChange={val => setMinCredits(val)}
                  placeholder="Minimum number of credits"
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={handleClose}>
              Close
            </Button>
            <Button colorScheme='blue' onClick={onSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CategoryModal;