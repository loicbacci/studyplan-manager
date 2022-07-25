
import { useEffect } from 'react';
import * as firebaseui from 'firebaseui';
import { auth, useAuth } from './firebase/config';
import { EmailAuthProvider } from 'firebase/auth';
import { Container, Flex, Heading, Stack } from '@chakra-ui/react';
import 'firebaseui/dist/firebaseui.css';
import Header from './components/Header';
import MetadataPage from './components/MetadataPage';

const ui = new firebaseui.auth.AuthUI(auth);


function App() {
  const { isLoggedIn } = useAuth();

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
      <Flex direction="column">
        <Header />
        <Container>
          <Stack spacing={6}>
            <Heading>Log In</Heading>
            <div id='firebaseui-auth-container'/>
          </Stack>
        </Container>
      </Flex> 

    );
  }

  return (
    <Flex direction="column">
      <Header loggedIn />
      <Container maxW="container.md">
        <MetadataPage />
      </Container>
    </Flex> 
  );
}

export default App;
