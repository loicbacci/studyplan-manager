import { Button, Heading, Text, useDisclosure } from "@chakra-ui/react";
import MetadataEntry from "../MetadataEntry";
import CategoryModal from "./CategoryModal";

interface CategoryEntryProps {
  category?: Category;
}

const CategoryEntry = (props: CategoryEntryProps) => {
  const { category } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {category ? (
        <MetadataEntry
          left={<Text>{category.name}</Text>}
          right={
            category.min_credits && (
              <Text>Minimum credits {category.min_credits}</Text>
            )
          }
          popoverHeader={category.notes && <Heading size="md">Notes</Heading>}
          popoverBody={category.notes && <Text>{category.notes}</Text>}
          onEdit={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="40">
          Add category
        </Button>
      )}

      <CategoryModal isOpen={isOpen} onClose={onClose} category={category} />
    </>
  );
};

export default CategoryEntry;
