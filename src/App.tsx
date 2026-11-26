import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import Home from "./pages/Home";
import Research from "./pages/Research";
import Publications from "./pages/Publications";
import Projects from "./pages/Projects";
import Honors from "./pages/Honors";
import Cv from "./pages/Cv";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/research", element: <Research /> },
  { path: "/publications", element: <Publications /> },
  { path: "/projects", element: <Projects /> },
  { path: "/honors", element: <Honors /> },
  { path: "/cv", element: <Cv /> },
  { path: "/about", element: <About /> },
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
