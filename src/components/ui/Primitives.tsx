import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function WaveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-5", className)} aria-hidden="true">
      <path
        d="M1.5 15.5c2.1 0 2.1-6 4.2-6s2.1 6 4.2 6 2.1-6 4.2-6 2.1 6 4.2 6 2.1-6 4.2-6"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M1.5 9.5c2.1 0 2.1-6 4.2-6s2.1 6 4.2 6 2.1-6 4.2-6 2.1 6 4.2 6 2.1-6 4.2-6"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.28"
      />
      <circle cx="20.1" cy="15.5" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-4", className)} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function Rule({ className }: { className?: string }) {
  return <div className={cn("rule", className)} aria-hidden="true" />;
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("tag", className)}>{children}</span>;
}

export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {index ? <span className="font-mono text-[10px] tracking-[0.2em] text-glow/70">{index}</span> : null}
      <span className="h-px w-8 bg-line" aria-hidden="true" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}
