import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

const STORAGE_KEY = "yr.preview";
const PARAM = "demo";

type PreviewContextValue = {
  preview: boolean;
  exit: () => void;
};

const PreviewContext = createContext<PreviewContextValue | null>(null);

/**
 * Preview mode is opt-in through ?demo=1 and persisted for the session so that
 * client-side navigation keeps showing sample entries. It never affects the
 * public record: sample content is excluded from the default build and pages
 * carrying it are set to noindex.
 */
export function PreviewProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const [preview, setPreview] = useState(() => {
    if (typeof window === "undefined") return false;
    const fromUrl = new URLSearchParams(window.location.search).get(PARAM) === "1";
    if (fromUrl) window.sessionStorage.setItem(STORAGE_KEY, "1");
    return fromUrl || window.sessionStorage.getItem(STORAGE_KEY) === "1";
  });

  useEffect(() => {
    if (params.get(PARAM) !== "1") return;
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    setPreview(true);
  }, [params]);

  const exit = useCallback(() => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setPreview(false);
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete(PARAM);
        return next;
      },
      { replace: true },
    );
  }, [setParams]);

  const value = useMemo(() => ({ preview, exit }), [preview, exit]);

  return <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>;
}

export function usePreview(): PreviewContextValue {
  const context = useContext(PreviewContext);
  if (!context) throw new Error("usePreview must be used within a PreviewProvider");
  return context;
}
