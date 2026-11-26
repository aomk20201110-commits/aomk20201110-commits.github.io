import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  // Start from the SSR-safe value so hydration matches, then adopt the real
  // media state on the client.
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

export function useIsCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
