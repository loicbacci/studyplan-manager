import React from "react";
import {
  AlertDialog, AlertDialogBody,
  AlertDialogContent, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button, IconButton,
  useDisclosure
} from "@chakra-ui/react";
import { FiTrash } from "react-icons/fi";

interface DeleteButtonProps {
  alertTitle: React.ReactNode
  onCancel: () => void,
  onDelete: () => void
}

const DeleteButton = (props: DeleteButtonProps) => {
  const { alertTitle, onCancel, onDelete } = props;

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  return (
    <>
      <IconButton colorScheme="red" aria-label="delete" icon={<FiTrash/>} onClick={onOpen}/>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {alertTitle}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => {
                onCancel();
                onClose();
              }}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={() => {
                onDelete();
                onClose();
              }} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default DeleteButton;