import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";
import { PageMeta, type PageMetaProps } from "../ui/PageMeta";

function scrollToHash(hash: string, behavior: ScrollBehavior) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior, block: "start" });
  }
}

/**
 * Page shell: metadata plus route-level scroll handling.
 */
export function Page({
  children,
  meta,
  flush = false,
  className,
}: {
  children: ReactNode;
  meta: PageMetaProps;
  flush?: boolean;
  className?: string;
}) {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const frame = requestAnimationFrame(() => scrollToHash(location.hash, "auto"));
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageMeta {...meta} />
      <main
        id="main"
        tabIndex={-1}
        className={cn("relative outline-none", flush ? "" : "pt-24 md:pt-32", className)}
      >
        {children}
      </main>
    </>
  );
}
