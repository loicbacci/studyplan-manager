import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { useDatabase } from "../firebase/database";
import CategoriesPage from "./category/CategoriesPage";
import SubCategoriesPage from "./subcategories/SubCategoriesPage";

const MetadataPage = () => {
  const { categories, subcategories } = useDatabase();

  return (
    <Stack>
      <Tabs>
        <TabList>
          {categories && <Tab>Categories</Tab>}
          {(subcategories && categories) && <Tab>Sub Categories</Tab>}
        </TabList>

        <TabPanels>
          {categories && (
            <TabPanel>
              <CategoriesPage categories={categories} />
            </TabPanel>
          )}
          {(subcategories && categories) && (
            <TabPanel>
              <SubCategoriesPage subcategories={subcategories} categories={categories} />
             </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Stack>
  )
}

export default MetadataPage;
