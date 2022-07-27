import {UseToastOptions} from "@chakra-ui/react";

export const toastSuccessOptions = (title: string): UseToastOptions => {
  return {
    title,
    status: "success",
    duration: 5000,
    isClosable: true,
  }
}

export const toastErrorOptions = (title: string): UseToastOptions => {
  return {
    title,
    status: "error",
    duration: 5000,
    isClosable: true,
  }
}