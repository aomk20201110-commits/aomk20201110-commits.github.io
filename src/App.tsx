import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import Home from "./pages/Home";

const Research = lazy(() => import("./pages/Research"));
const Publications = lazy(() => import("./pages/Publications"));
const Projects = lazy(() => import("./pages/Projects"));
const Honors = lazy(() => import("./pages/Honors"));
const Cv = lazy(() => import("./pages/Cv"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center" role="status" aria-live="polite">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel">Loading</span>
      <span className="ml-3 size-1.5 animate-pulse rounded-full bg-glow" aria-hidden="true" />
    </div>
  );
}

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
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<Research />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/honors" element={<Honors />} />
          <Route path="/cv" element={<Cv />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}
