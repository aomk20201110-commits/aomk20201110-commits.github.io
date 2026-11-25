import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

const STORAGE_KEY = "yr.motion";

type MotionPreference = {
  /** Effective preference: explicit override, otherwise the operating system setting. */
  reduced: boolean;
  /** Whether the operating system asks for reduced motion. */
  systemReduced: boolean;
  /** Explicit override, or null when following the system. */
  override: boolean | null;
  setOverride: (value: boolean | null) => void;
  toggle: () => void;
};

const MotionPreferenceContext = createContext<MotionPreference | null>(null);

function readOverride(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "reduced") return true;
    if (stored === "full") return false;
  } catch {
    /* ignore */
  }
  return null;
}

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const systemReduced = useReducedMotion() ?? false;
  const [override, setOverrideState] = useState<boolean | null>(readOverride);
  const reduced = override ?? systemReduced;

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  const setOverride = useCallback((value: boolean | null) => {
    setOverrideState(value);
    try {
      if (value === null) window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, value ? "reduced" : "full");
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setOverride(!reduced);
  }, [reduced, setOverride]);

  const value = useMemo<MotionPreference>(
    () => ({ reduced, systemReduced, override, setOverride, toggle }),
    [reduced, systemReduced, override, setOverride, toggle],
  );

  return <MotionPreferenceContext.Provider value={value}>{children}</MotionPreferenceContext.Provider>;
}

export function useMotionPreference(): MotionPreference {
  const context = useContext(MotionPreferenceContext);
  if (!context) throw new Error("useMotionPreference must be used inside MotionPreferenceProvider");
  return context;
}
