import React from "react";
import MetadataModal from "../metadata/MetadataModal";
import {Button, Stack, Text, useDisclosure} from "@chakra-ui/react";

interface TestElem extends BaseData {
  textField: string
  textSelectField: string,
  numberField: number
}

const DashboardPage = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const textField: TextField = {
    name: "textField",
    initialValue: "Text field value",
    label: "Text field label",
    placeholder: "Text field placeholder"
  }

  const numberField: NumberField = {
    name: "numberField",
    initialValue: 10,
    label: "Number field label",
    placeholder: "Number field placeholder",
    minNumber: 5,
    maxNumber: 15
  }

  const textSelectField: TextSelectField = {
    name: "textSelectField",
    initialValue: "Text select field value",
    label: "Text select field label",
    placeholder: "Text select field placeholder",
    isRequired: true,
    validate: (val) => val === "Text select field value" ? "Enter val" : "",
    possibleValues: ["a", "b", "c", "d"]
  }

  const onSubmit = (elem: Omit<TestElem, "id">) => {
    alert(JSON.stringify(elem));
    onClose();
  }

  return (
    <Stack>
      Dashboard page

      <Button onClick={onOpen}>Open modal</Button>

      <MetadataModal
        headerTitle={<Text>Test</Text>}
        fields={[
          textField,
          textSelectField,
          numberField
        ]}
        onSubmit={onSubmit}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Stack>
  )
}

export default DashboardPage;
