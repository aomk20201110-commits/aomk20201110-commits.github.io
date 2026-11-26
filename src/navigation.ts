import config from "../site.config.json";

const pageKeys = config.pages.map((page) => page.key);

export type PageKey = (typeof pageKeys)[number];

export const navigation = config.pages.map((page) => ({
  key: page.key,
  path: page.path,
  index: page.index,
})) as ReadonlyArray<{ key: PageKey; path: string; index: string }>;

export type NavItem = (typeof navigation)[number];
