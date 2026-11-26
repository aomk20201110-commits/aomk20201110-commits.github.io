import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { Page, type PageKey } from "./lib/page-loaders";

const routes: { path: string; page: PageKey }[] = [
  { path: "/", page: "home" },
  { path: "/research", page: "research" },
  { path: "/publications", page: "publications" },
  { path: "/projects", page: "projects" },
  { path: "/projects/:id", page: "projectDetail" },
  { path: "/honors", page: "honors" },
  { path: "/cv", page: "cv" },
  { path: "/about", page: "about" },
  { path: "/notes", page: "notes" },
];

export default function App() {
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
        {routes.map(({ path, page }) => (
          <Route key={path} path={path} element={<Page page={page} />} />
        ))}
        {routes
          .filter((route) => route.path !== "/")
          .map(({ path, page }) => (
            <Route key={`zh${path}`} path={`/zh${path}`} element={<Page page={page} />} />
          ))}
        <Route path="/zh" element={<Page page="home" />} />
        <Route path="*" element={<Page page="notFound" />} />
      </Routes>
      <Footer />
    </div>
  );
}
