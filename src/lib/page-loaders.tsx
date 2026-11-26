import { useEffect, useState, type ComponentType } from "react";
import { stripLocale } from "./routes";

export type PageModule = { default: ComponentType };

/**
 * Route-level chunks. The server preloads every module before rendering, and
 * the browser preloads only the module for the current static document before
 * hydration, so the first client render matches the server mark-up exactly.
 */
const loaders = {
  home: () => import("../pages/Home"),
  research: () => import("../pages/Research"),
  publications: () => import("../pages/Publications"),
  projects: () => import("../pages/Projects"),
  projectDetail: () => import("../pages/ProjectDetail"),
  honors: () => import("../pages/Honors"),
  cv: () => import("../pages/Cv"),
  about: () => import("../pages/About"),
  notes: () => import("../pages/Notes"),
  notFound: () => import("../pages/NotFound"),
} satisfies Record<string, () => Promise<PageModule>>;

export type PageKey = keyof typeof loaders;

const cache: Partial<Record<PageKey, ComponentType>> = {};

export async function preloadPage(key: PageKey): Promise<void> {
  if (cache[key]) return;
  const module = await loaders[key]();
  cache[key] = module.default;
}

export function pageKeyForPath(pathname: string): PageKey {
  const path = stripLocale(pathname).replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (path === "/research") return "research";
  if (path === "/publications") return "publications";
  if (path === "/projects") return "projects";
  if (path.startsWith("/projects/")) return "projectDetail";
  if (path === "/honors") return "honors";
  if (path === "/cv") return "cv";
  if (path === "/about") return "about";
  if (path === "/notes") return "notes";
  return "notFound";
}

export async function preloadRoute(pathname: string): Promise<void> {
  await preloadPage(pageKeyForPath(pathname));
}

export async function preloadAllPages(): Promise<void> {
  await Promise.all((Object.keys(loaders) as PageKey[]).map(preloadPage));
}

type LoadedPage = { page: PageKey; Component: ComponentType };

function DeferredPage({ page }: { page: PageKey }) {
  const [loaded, setLoaded] = useState<LoadedPage | null>(() =>
    cache[page] ? { page, Component: cache[page]! } : null,
  );

  useEffect(() => {
    if (loaded?.page === page) return;
    let alive = true;
    preloadPage(page).then(() => {
      if (alive && cache[page]) setLoaded({ page, Component: cache[page]! });
    });
    return () => {
      alive = false;
    };
  }, [loaded?.page, page]);

  if (loaded?.page === page) {
    const { Component } = loaded;
    return <Component />;
  }
  return null;
}

/** Renders a route from the preloaded chunk cache, or loads it on navigation. */
export function Page({ page }: { page: PageKey }) {
  const Component = cache[page];
  return Component ? <Component /> : <DeferredPage page={page} />;
}
