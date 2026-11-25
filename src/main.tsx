import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./styles/index.css";

import "./i18n";
import App from "./App";
import { MotionPreferenceProvider } from "./lib/motion";
import { PreviewProvider } from "./lib/preview";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root was not found in the document.");
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <PreviewProvider>
        <MotionPreferenceProvider>
          <App />
        </MotionPreferenceProvider>
      </PreviewProvider>
    </BrowserRouter>
  </StrictMode>,
);
