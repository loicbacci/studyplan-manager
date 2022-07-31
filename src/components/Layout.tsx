import { Flex, Container } from "@chakra-ui/react";
import React from "react";
import Header from "./Header";
import { useAuth } from "../lib/auth";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;
  const { isLoggedIn } = useAuth();

  return (
    <Flex direction="column" mb={16}>
      <Header />
      <Container maxW={isLoggedIn ? "container.lg" : "container.md"}>
        {children}
      </Container>
    </Flex>
  );
};

export default Layout;
