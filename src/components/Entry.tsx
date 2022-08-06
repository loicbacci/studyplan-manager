import {
  Center, Checkbox,
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
  onClick: () => void;
  border?: boolean,
  iconSize?: string,

  isChecked?: boolean
  onCheck?: (checked: boolean) => void
}

const Entry = (props: EntryProps) => {
  const { left, right, onClick, popoverHeader, popoverBody, border, iconSize, isChecked, onCheck } = props;

  const hasPopover = popoverHeader !== undefined || popoverBody !== undefined;

  const LeftElem = hasPopover ? (
    <Popover>
      <PopoverTrigger>
        <Center ml={border ? 4 : 1}>
          {left}
        </Center>
      </PopoverTrigger>
     <PopoverContent>
          <PopoverArrow/>
          <PopoverCloseButton/>
          {popoverHeader && <PopoverHeader>{popoverHeader}</PopoverHeader>}
          {popoverBody && <PopoverBody>{popoverBody}</PopoverBody>}
        </PopoverContent>
    </Popover>
  ) : (
    <Center ml={border ? 4 : 1}>
      {left}
    </Center>
  );

  return (
    <Flex borderWidth={border ? "1px" : ""} borderRadius="md" w="100%">
      {LeftElem}

      <Spacer/>

      <HStack spacing={4}>
        {right}
        {(onCheck !== undefined && isChecked !== undefined) ? (
          <Checkbox isChecked={isChecked} onChange={e => onCheck(e.target.checked)} />
        ) : (
          <IconButton aria-label="Edit" icon={<FiEdit/>} onClick={onClick} size={iconSize}/>
        )}
      </HStack>
    </Flex>
  );
};

export default Entry;
