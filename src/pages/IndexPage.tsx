import React from "react";
import { Button, Heading, Stack, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
  const navigate = useNavigate();

  return (
    <VStack spacing={8}>
      <Heading>Home page</Heading>

      <Stack>
        <Button onClick={() => navigate("/programmes")}>
          See programmes
        </Button>

        <Button onClick={() => navigate("/plans")}>
          See plans
        </Button>
      </Stack>
    </VStack>
  )
}

export default IndexPage;