import { useEffect, useState, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLink } from "../ui/Links";

type LabTab = "array" | "resonance";

const loaders: Record<LabTab, () => Promise<{ default: ComponentType }>> = {
  array: () => import("./ArrayFactorLab"),
  resonance: () => import("./ResonanceLab"),
};

const cache: Partial<Record<LabTab, ComponentType>> = {};

function LabPanel({ tab }: { tab: LabTab }) {
  const { t } = useTranslation();
  const [Component, setComponent] = useState<ComponentType | null>(
    () => cache[tab] ?? null,
  );

  useEffect(() => {
    if (cache[tab]) {
      setComponent(() => cache[tab] as ComponentType);
      return;
    }
    let alive = true;
    loaders[tab]().then((mod) => {
      cache[tab] = mod.default;
      if (alive) setComponent(() => mod.default);
    });
    return () => {
      alive = false;
    };
  }, [tab]);

  if (!Component) {
    return (
      <div
        className="min-h-[600px] border border-line bg-panel/10"
        aria-busy="true"
        aria-label={t("common.loading")}
      />
    );
  }

  return (
    <div key={tab}>
      <Component />
      {tab === "array" ? (
        <p className="caption mt-4 max-w-2xl">{t("home.labCaption")}</p>
      ) : null}
    </div>
  );
}

export default function InstrumentTabs() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<LabTab>("array");

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line">
        <div className="flex gap-1" role="tablist" aria-label={t("home.labEyebrow")}>
          {(
            [
              ["array", t("home.workArrayTitle")],
              ["resonance", t("home.workResonanceTitle")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              id={`tab-${id}`}
              onClick={() => setTab(id)}
              className={
                tab === id
                  ? "border-b border-glow px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-glow"
                  : "border-b border-transparent px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-steel transition-colors hover:text-ice"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <ArrowLink to="/research" variant="quiet">
          {t("common.viewAll")}
        </ArrowLink>
      </div>

      <div className="mt-6">
        <div
          id="panel-array"
          role="tabpanel"
          aria-labelledby="tab-array"
          hidden={tab !== "array"}
        >
          {tab === "array" ? <LabPanel tab="array" /> : null}
        </div>
        <div
          id="panel-resonance"
          role="tabpanel"
          aria-labelledby="tab-resonance"
          hidden={tab !== "resonance"}
        >
          {tab === "resonance" ? <LabPanel tab="resonance" /> : null}
        </div>
      </div>
    </div>
  );
}
