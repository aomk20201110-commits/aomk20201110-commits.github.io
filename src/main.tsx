import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
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
import { preloadRoute } from "./lib/page-loaders";
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

// Load only the chunk needed by the current static document before adopting it.
// The server rendered the same route from the same component tree, so React can
// hydrate the existing mark-up instead of discarding the first paint.
await preloadRoute(window.location.pathname);
hydrateRoot(container, tree);
