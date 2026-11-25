import type { ReactNode } from "react";
import { Eyebrow } from "./Primitives";

export function PageHeader({
  index,
  eyebrow,
  title,
  lede,
  aside,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lede: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="shell pb-12 pt-6 md:pb-16 md:pt-8">
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <h1 className="text-gradient mt-8 max-w-5xl font-display text-[clamp(2.7rem,7vw,6rem)] leading-[0.94] tracking-[-0.045em]">
        {title}
      </h1>
      <div className="mt-10 grid gap-6 border-t border-white/6 pt-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-start md:gap-12">
        <p className="max-w-2xl text-base leading-relaxed text-mist md:text-lg">{lede}</p>
        {aside ? <div className="md:justify-self-end md:text-right">{aside}</div> : null}
      </div>
      {children}
    </header>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  action,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.04em] text-gradient">
          {title}
        </h2>
      </div>
      <div className="lg:col-span-4 lg:justify-self-end">
        {lede ? <p className="max-w-md text-sm leading-relaxed text-steel md:text-[15px]">{lede}</p> : null}
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
