import { Stack, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { useDatabase } from "../firebase/database";
import CategoriesPage from "./CategoriesPage";

const MetadataPage = () => {
  const { categories, seasons, semesters, subcategories } = useDatabase();

  return (
    <Stack>
      <Tabs>
        <TabList>
          {categories && <Tab>Categories</Tab>}
        </TabList>

        <TabPanels>
          {categories && (
            <TabPanel>
              <CategoriesPage categories={categories} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Stack>
  )
}

export default MetadataPage;
