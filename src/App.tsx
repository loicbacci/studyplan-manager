
import React, { useEffect, ReactNode } from 'react';
import * as firebaseui from 'firebaseui';
import { auth, useFirebase } from './firebase/config';
import { EmailAuthProvider } from 'firebase/auth';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Container, Heading, ListItem, Stack, UnorderedList } from '@chakra-ui/react';
import 'firebaseui/dist/firebaseui.css';
import { useDatabase } from './firebase/database';
import CourseModal from './CourseModal';

const ui = new firebaseui.auth.AuthUI(auth);

interface DataItemProps<T> {
  elems: T[],
  toShow: (elem: T) => ReactNode,
  name: string
}

const DataItem = <T extends BaseData>(props: DataItemProps<T>) => {
  const { elems, toShow, name } = props;

  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex='1' textAlign='left'>
            {name}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <UnorderedList>
          {elems.map(elem => <ListItem>{toShow(elem)}</ListItem>)}
        </UnorderedList>
      </AccordionPanel>
    </AccordionItem>
  )  
}

function App() {
  const isLoggedIn = useFirebase();
  const { categories, seasons, semesters, subcategories, courses } = useDatabase();

  useEffect(() => {
    if (isLoggedIn) return;

    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID
      ]
    })
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Container>
        <Stack>
          <Heading>Log In</Heading>
          <div id='firebaseui-auth-container'/>
        </Stack>
      </Container>
    );
  }

  return (
    <Container>
      <Stack>
        <Heading>Logged In</Heading>
        <Accordion allowToggle={true}>
          {categories && (
            <DataItem
              elems={categories}
              toShow={cat => cat.name}
              name="Categories"
            />)}
          {seasons && (
            <DataItem
              elems={seasons}
              toShow={season => season.name}
              name="Seasons"
          />)}
          {semesters && (
            <DataItem
              elems={semesters}
              toShow={semester => semester.name}
              name="Semesters"
            />)}
          {subcategories && (
            <DataItem
              elems={subcategories}
              toShow={subcategory => subcategory.name}
              name="Sub categories"
          />)}
          {courses && (
            <DataItem
              elems={courses}
              toShow={course => <CourseModal course={course} />}
              name="Courses"
          />)}
        </Accordion>
      </Stack>
    </Container>
  );
}

export default App;
