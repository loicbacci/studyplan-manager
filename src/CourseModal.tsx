import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Text, FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";

interface CourseModalProps {
  course?: Course
}

function CourseModal (props: CourseModalProps) {
  const { course } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState(course ? course.name : '');

  return (
    <>
      <Button onClick={onOpen}>
        {course ? course.name : "Add course"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{course ? "Edit " : "Add "} Course</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter name"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='green'>
              Save
              </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CourseModal;