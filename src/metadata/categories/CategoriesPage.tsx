import { Stack } from "@chakra-ui/react";
import CategoryEntry from "./CategoryEntry";

interface CategoriesPageProps {
  categories: Category[];
}

const CategoriesPage = (props: CategoriesPageProps) => {
  const { categories } = props;

  return (
    <Stack>
      {categories && (
        <Stack>
          {categories.map((cat) => (
            <CategoryEntry category={cat} key={cat.id} />
          ))}
        </Stack>
      )}
      <CategoryEntry />
    </Stack>
  );
};

export default CategoriesPage;
