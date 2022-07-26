import { Button, Heading, Text, useDisclosure } from "@chakra-ui/react";
import MetadataEntry from "../MetadataEntry";
import SubCategoryModal from "./SubcategoryModal";

interface SubCategoryEntryProps {
  subCategory?: SubCategory;
  categories: Category[]
}

const SubCategoryEntry = (props: SubCategoryEntryProps) => {
  const { subCategory, categories } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {subCategory ? (
        <MetadataEntry
          left={<Text>{subCategory.name}</Text>}
          right={
            subCategory.min_credits && (
              <Text>Minimum credits {subCategory.min_credits}</Text>
            )
          }
          popoverHeader={subCategory.notes && <Heading size="md">Notes</Heading>}
          popoverBody={subCategory.notes && <Text>{subCategory.notes}</Text>}
          onEdit={onOpen}
        />
      ) : (
        <Button onClick={onOpen} w="40">
          Add sub-category
        </Button>
      )}

      <SubCategoryModal isOpen={isOpen} onClose={onClose} subCategory={subCategory} categories={categories}/>
    </>
  );
};

export default SubCategoryEntry;
