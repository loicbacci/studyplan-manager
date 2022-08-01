import React from "react";
import {
  Badge, Box,
  Button, Divider, Flex,
  Heading,
  HStack, IconButton,
  Link, Spacer,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
  useDisclosure, VStack
} from "@chakra-ui/react";
import Entry from "../../components/Entry";
import { Link as RLink } from "react-router-dom";
import DataModal from "../../components/DataModal";
import { FiChevronDown, FiChevronUp, FiEdit } from "react-icons/fi";
import SubCategoriesList from "../subcategories/SubCategoriesList";

interface CategoriesListEntryBaseProps {
  category?: Category,
  programmeId?: string,
  addCategory?: (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => void,
  updateCategory?: (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => void,
  removeCategory?: () => void,
}

const CategoriesListEntryBase = (props: CategoriesListEntryBaseProps) => {
  const { category, addCategory, updateCategory, removeCategory, programmeId } = props;
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isSubOpen, onToggle: onSubToggle } = useDisclosure();

  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const isEditing = category !== undefined && updateCategory !== undefined && removeCategory !== undefined;
  const isAdding = addCategory !== undefined;

  const getMajorMinorInitialValue = () => {
    if (!category) return "None";

    if (category.is_major) return "Major";
    if (category.is_minor) return "Minor";

    return "None";
  }

  const nameField: TextField = {
    name: "name",
    initialValue: category ? category.name : "",
    label: "Name",
    placeholder: "Enter name",
    validate: (v) => v === "" ? "Please enter name" : "",
    isRequired: true
  }

  const isMajorMinorField: RadioField = {
    name: "majorMinor",
    initialValue: getMajorMinorInitialValue(),
    label: "Is the category for a major, a minor or neither?",
    placeholder: "",
    possibleValues: ["Major", "Minor", "None"],
    isRequired: true,
    isRadio: true
  }

  const notesField: TextField = {
    name: "notes",
    initialValue: (category && category.notes) ? category.notes : undefined,
    label: "Notes",
    placeholder: "Enter notes",
    undefinedType: "string",
    textArea: true
  }

  const minCreditsField: NumberField = {
    name: "min_credits",
    initialValue: (category && category.min_credits) ? category.min_credits : undefined,
    label: "Minimum credits",
    placeholder: "Enter minimum credits",
    undefinedType: "number",
    minNumber: 0
  }

  const onSubmit = (elem: Omit<Category, "id">) => {
    const majorMinor = (elem as any).majorMinor;

    if (majorMinor === "Major") {
      elem.is_major = true;
      elem.is_minor = false;
    } else if (majorMinor === "Minor") {
      elem.is_minor = true;
      elem.is_major = false;
    } else {
      elem.is_minor = false;
      elem.is_major = false;
    }

    delete (elem as any).majorMinor

    console.log(elem)

    if (isEditing) {
      // EDIT
      // Need to remove the undefined
      updateCategory(elem.name, elem.is_major, elem.is_minor, elem.min_credits, elem.notes);
    } else if (isAdding) {
      // ADD
      addCategory(elem.name, elem.is_major, elem.is_minor, elem.min_credits, elem.notes);
    }

    onModalClose();
  }

  const onDelete = () => {
    if (isEditing) {
      removeCategory();
    }

    onModalClose();
  }

  return (
    <>
      {isEditing ? (
        <Stack borderWidth="1px" borderRadius="md" py={{ base: 1, lg: 2 }} px={2} w="100%" spacing={0}>
          {isDesktop ? (
            <Entry
              left={
                <Stack spacing={0}>
                  <HStack>
                    {category.is_major && <Tag colorScheme="blue" size="sm">MAJOR</Tag>}
                    {category.is_minor && <Tag colorScheme="purple" size="sm">MINOR</Tag>}
                    <Text>{category.name}</Text>
                  </HStack>

                  {category.notes && <Text color="gray">{category.notes}</Text>}
                </Stack>
              }
              right={category.min_credits && <Text>{category.min_credits} minimum credits</Text>}
              onEdit={onModalOpen}
            />
          ) : (
            <Flex>
              <Flex direction="column" alignItems="start" justify="center">
                {category.is_major && <Tag colorScheme="blue" size="sm">MAJOR</Tag>}
                {category.is_minor && <Tag colorScheme="purple" size="sm">MINOR</Tag>}
                <Text>{category.name}</Text>
                {category.min_credits && <Text color="gray">{category.min_credits} min credits</Text>}
              </Flex>

              <Spacer/>

              <IconButton
                variant="ghost"
                aria-label="Open menu"
                icon={isSubOpen ? <FiChevronUp  fontSize="1.25rem"/> : <FiChevronDown fontSize="1.25rem"/>}
                onClick={onSubToggle}
                size="sm"
              />
            </Flex>
          )}

          {((isDesktop || (!isDesktop && isSubOpen)) && programmeId) && (
            <Stack>
              {!isDesktop && (
                <Stack spacing={0}>
                  {category.notes && <Text color="gray">{category.notes}</Text>}
                  <IconButton aria-label="Edit" icon={<FiEdit/>} onClick={onModalOpen} size="sm" w="fit-content"/>
                  <Divider py={1} />
                </Stack>
              )}

              <Box pl={4}>
                <Box w="100%" pl={4} borderLeft="1px" borderColor="gray.400">
                  <SubCategoriesList programmeId={programmeId} categoryId={category.id}/>
                </Box>
              </Box>
            </Stack>

          )}
        </Stack>
      ) : (
        <Button onClick={onModalOpen} w="fit-content" size="sm">
          Add category
        </Button>
      )}


      <DataModal
        headerTitle={<Text>{isEditing ? "Edit" : "Add"} Category</Text>}
        alertTitle={<Text>Delete Category</Text>}
        fields={[nameField, isMajorMinorField, minCreditsField, notesField]}
        onSubmit={onSubmit}
        onDelete={isEditing ? onDelete : undefined}
        isOpen={isModalOpen}
        onClose={onModalClose}
      />
    </>

  )
}

interface CategoriesListEntryProps {
  category: Category,
  updateCategory?: (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => void,
  removeCategory?: () => void,
  programmeId: string
}

export const CategoriesListEntry = (props: CategoriesListEntryProps) => {
  const { category, updateCategory, removeCategory, programmeId } = props;

  return (
    <CategoriesListEntryBase
      category={category}
      updateCategory={updateCategory}
      removeCategory={removeCategory}
      programmeId={programmeId}
    />
  )
}

interface AddCategoryButtonProps {
  addCategory?: (name: string, isMajor: boolean, isMinor: boolean, minCredits?: number, notes?: string) => void,
}

export const AddCategoryButton = (props: AddCategoryButtonProps) => {
  const { addCategory } = props;

  return (
    <CategoriesListEntryBase
      addCategory={addCategory}
    />
  )
}
