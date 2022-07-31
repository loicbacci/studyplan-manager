import {
  Center,
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
  border?: boolean,
  iconSize?: string
}

const Entry = (props: EntryProps) => {
  const { left, right, onEdit, popoverHeader, popoverBody, border, iconSize } = props;

  return (
    <Flex borderWidth={border ? "1px" : ""} borderRadius="md" w="100%">
      <Popover>
        <PopoverTrigger>
          <Center ml={border ? 4 : 1}>
            {left}
          </Center>
        </PopoverTrigger>
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
        <IconButton aria-label="Edit" icon={<FiEdit/>} onClick={onEdit} size={iconSize}/>
      </HStack>
    </Flex>
  );
};

export default Entry;
