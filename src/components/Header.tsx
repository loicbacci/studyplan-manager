import { useColorModeValue, Heading, Container, HStack, Flex, Button, Box, Spacer, Link } from "@chakra-ui/react";
import { auth } from "../firebase/config";

interface HeaderProps {
  loggedIn?: boolean
}

const Header = (props: HeaderProps) => {
  const { loggedIn } = props;

  const onLogOutClick = () => {
    auth.signOut();
  }

  return (
    <Box pb={6}>
      <Box boxShadow={useColorModeValue('sm', 'sm-dark')}>
        <Container maxW="container.lg" py={4} >
          <Flex>
            <HStack spacing={4}>
              <Heading size="lg" pr={4}>Study Plan Manager</Heading>
              {loggedIn && (
                <>
                  <Link>Dashboard</Link>
                  <Link>Courses</Link>
                  <Link>Metadata</Link>
                </>
                
              )}
            </HStack>
            
            <Spacer />
            {loggedIn && <Button onClick={onLogOutClick}>Log Out</Button>}
          </Flex>
        </Container>
      </Box>
    </Box>
    
  )
}

export default Header;
