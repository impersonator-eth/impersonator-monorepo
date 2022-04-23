import { createRoot } from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
