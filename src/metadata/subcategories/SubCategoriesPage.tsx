import { Stack } from "@chakra-ui/react";
import SubCategoryEntry from "./SubcategoryEntry";

interface SubCategoriesPageProps {
  subcategories: SubCategory[];
  categories: Category[]
}

const SubCategoriesPage = (props: SubCategoriesPageProps) => {
  const { subcategories, categories } = props;

  return (
    <Stack>
      {subcategories && (
        <Stack>
          {subcategories.map((subCat) => (
            <SubCategoryEntry subCategory={subCat} key={subCat.id} categories={categories} />
          ))}
        </Stack>
      )}
      <SubCategoryEntry categories={categories} />
    </Stack>
  );
};

export default SubCategoriesPage;
