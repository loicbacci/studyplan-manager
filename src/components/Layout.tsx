import { Flex, Container } from "@chakra-ui/react";
import React from "react";
import Header from "./Header";

interface LayoutProps {
  children?: React.ReactNode;
  loggedIn?: boolean;
}

const Layout = (props: LayoutProps) => {
  const { children, loggedIn } = props;

  return (
    <Flex direction="column">
      <Header loggedIn={loggedIn} />
      <Container maxW={loggedIn ? "container.lg" : "container.md"}>
        {children}
      </Container>
    </Flex>
  );
};

export default Layout;
