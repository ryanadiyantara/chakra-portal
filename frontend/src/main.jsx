import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import theme from "./theme/theme.js";

// Get the root element
const rootElement = document.getElementById("root");

// Create the root and render the application
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme} resetCss={false}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
);
