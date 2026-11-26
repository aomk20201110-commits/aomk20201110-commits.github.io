import { renderToString } from "react-dom/server";
import { Route, Routes, StaticRouter } from "react-router";
import type { Lang } from "./lib/localized";
import "./i18n";
import i18n from "./i18n";
import { LangSync } from "./components/system/LangSync";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { MotionPreferenceProvider } from "./lib/motion";
import { PreviewProvider } from "./lib/preview";
import { ThemeProvider } from "./lib/theme";
import Home from "./pages/Home";
import Research from "./pages/Research";
import Publications from "./pages/Publications";
import Projects from "./pages/Projects";
import Honors from "./pages/Honors";
import Cv from "./pages/Cv";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export { availability } from "./lib/content";
export { arrayPattern, analyseArray, gratingLimit } from "./lib/models/array";
export {
  RESONANCE_PRESETS,
  resonanceCurve,
  resonanceMetrics,
} from "./lib/models/resonance";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/research", element: <Research /> },
  { path: "/publications", element: <Publications /> },
  { path: "/projects", element: <Projects /> },
  { path: "/honors", element: <Honors /> },
  { path: "/cv", element: <Cv /> },
  { path: "/about", element: <About /> },
];

// The prerender tree is intentionally static: every page is imported eagerly
// so that renderToString emits the full document instead of a Suspense
// fallback. The client still loads pages lazily and mounts normally.
function ServerApp() {
  return (
    <div className="flex min-h-svh flex-col bg-void">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-glow/40 focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-glow"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {routes
          .filter((route) => route.path !== "/")
          .map((route) => (
            <Route key={`zh${route.path}`} path={`/zh${route.path}`} element={route.element} />
          ))}
        <Route path="/zh" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export async function render(pathname: string, lang: Lang): Promise<string> {
  await i18n.changeLanguage(lang);
  return renderToString(
    <StaticRouter location={pathname}>
      <LangSync />
      <ThemeProvider>
        <PreviewProvider>
          <MotionPreferenceProvider>
            <ServerApp />
          </MotionPreferenceProvider>
        </PreviewProvider>
      </ThemeProvider>
    </StaticRouter>,
  );
}
