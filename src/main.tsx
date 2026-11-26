import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./styles/index.css";

import "./i18n";
import App from "./App";
import { LangSync } from "./components/system/LangSync";
import { MotionPreferenceProvider } from "./lib/motion";
import { PreviewProvider } from "./lib/preview";
import { ThemeProvider } from "./lib/theme";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root was not found in the document.");
}

const tree = (
  <StrictMode>
    <BrowserRouter>
      <LangSync />
      <ThemeProvider>
        <PreviewProvider>
          <MotionPreferenceProvider>
            <App />
          </MotionPreferenceProvider>
        </PreviewProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);

// The prerendered HTML is a complete static document for crawlers and for the
// first paint. The client mounts over it (rather than hydrating a lazy route
// tree), which keeps route-level code splitting simple and avoids Suspense
// mismatches. The markup is generated from the same components, so the visual
// result is stable.
container.replaceChildren();
createRoot(container).render(tree);
