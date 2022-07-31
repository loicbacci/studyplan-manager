import {
  Flex,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import { FiEdit } from "react-icons/fi";

interface EntryProps {
  left: React.ReactNode;
  right?: React.ReactNode;
  popoverHeader?: React.ReactNode;
  popoverBody?: React.ReactNode;
  onEdit: () => void;
}

const Entry = (props: EntryProps) => {
  const { left, right, onEdit, popoverHeader, popoverBody } = props;

  return (
    <Flex>
      <Popover>
        <PopoverTrigger>{left}</PopoverTrigger>
        {(popoverHeader || popoverBody) && (
          <PopoverContent>
            <PopoverArrow/>
            <PopoverCloseButton/>
            {popoverHeader && <PopoverHeader>{popoverHeader}</PopoverHeader>}
            {popoverBody && <PopoverBody>{popoverBody}</PopoverBody>}
          </PopoverContent>
        )}
      </Popover>

      <Spacer/>
      <HStack spacing={4}>
        {right}
        <IconButton aria-label="Edit" icon={<FiEdit/>} onClick={onEdit}/>
      </HStack>
    </Flex>
  );
};

export default Entry;
