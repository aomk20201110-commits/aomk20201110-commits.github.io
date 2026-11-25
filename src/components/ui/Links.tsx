import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

type BaseProps = {
  children: ReactNode;
  className?: string;
  /** Visual variant. `quiet` has no underline until hover. */
  variant?: "default" | "quiet";
};

function Content({ children }: { children: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      <ArrowUpRight
        className="size-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </>
  );
}

export function ArrowLink({
  to,
  href,
  children,
  className,
  variant = "default",
  external = false,
}: BaseProps & ({ to: string; href?: never; external?: boolean } | { href: string; to?: never; external?: boolean })) {
  const classes = cn(
    "group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-silver transition-colors hover:text-glow",
    variant === "default" && "link-underline",
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        <Content>{children}</Content>
      </a>
    );
  }

  return (
    <Link to={to ?? "/"} className={classes}>
      <Content>{children}</Content>
    </Link>
  );
}

export function CtaLink({
  to,
  href,
  children,
  variant = "primary",
  className,
  external = false,
  download,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
  download?: boolean | string;
}) {
  const classes = cn("btn group", variant === "primary" ? "btn-primary" : "btn-ghost", className);
  const inner = (
    <>
      <span>{children}</span>
      <ArrowUpRight
        className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        {...(download ? { download } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link to={to ?? "/"} className={classes}>
      {inner}
    </Link>
  );
}
