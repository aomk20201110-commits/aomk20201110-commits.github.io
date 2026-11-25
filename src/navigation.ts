export const navigation = [
  { key: "home", path: "/", index: "00" },
  { key: "research", path: "/research", index: "01" },
  { key: "publications", path: "/publications", index: "02" },
  { key: "projects", path: "/projects", index: "03" },
  { key: "honors", path: "/honors", index: "04" },
  { key: "cv", path: "/cv", index: "05" },
  { key: "about", path: "/about", index: "06" },
] as const;

export type NavItem = (typeof navigation)[number];
