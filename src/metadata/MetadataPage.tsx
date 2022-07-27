import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { useDatabase } from "../firebase/database";
import CategoriesPage from "./categories/CategoriesPage";
import SeasonsPage from "./seasons/SeasonsPage";
import SemestersPage from "./semesters/SemestersPage";
import SubCategoriesPage from "./subcategories/SubCategoriesPage";
import MinorsPage from "./minors/MinorsPage";

const MetadataPage = () => {
  const { categories, subcategories, seasons, semesters, minors } = useDatabase();

  return (
    <Stack>
      <Tabs>
        <TabList>
          {minors && <Tab>Minors</Tab>}
          {categories && <Tab>Categories</Tab>}
          {(subcategories && categories) && <Tab>Sub Categories</Tab>}
          {seasons && <Tab>Seasons</Tab>}
          {semesters && <Tab>Semesters</Tab>}
        </TabList>

        <TabPanels>
          {minors && (
            <TabPanel>
              <MinorsPage minors={minors} />
            </TabPanel>
          )}
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
          {seasons && (
            <TabPanel>
              <SeasonsPage seasons={seasons} />
            </TabPanel>
          )}
          {semesters && (
            <TabPanel>
              <SemestersPage semesters={semesters} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Stack>
  )
}

export default MetadataPage;
