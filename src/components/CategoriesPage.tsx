import { Heading, Stack } from "@chakra-ui/react";
import React from "react";
import CategoryModal from "../modals/CategoryModal";

interface CategoriesPageProps {
  categories: Category[]
}

const CategoriesPage = (props: CategoriesPageProps) => {
  const { categories } = props;

  return (
    <Stack>
      {categories && (
        <Stack>
          {categories.map(cat => <CategoryModal category={cat} key={cat.id} />)}
        </Stack>
      )}
      <CategoryModal />
    </Stack>
  );
}

export default CategoriesPage;
