import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Page } from "../components/layout/Page";
import { WaveMark } from "../components/ui/Primitives";
import { CtaLink } from "../components/ui/Links";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Page meta={{ title: t("meta.notFoundTitle"), description: t("meta.notFoundDesc"), path: "/404", noindex: true }}>
      <div className="shell flex min-h-[calc(100svh-6rem)] flex-col justify-center pb-24">
        <WaveMark className="h-6 w-24 text-glow/60" />
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.24em] text-steel">{t("notFound.eyebrow")}</p>
        <h1 className="mt-4 font-display text-[clamp(3rem,10vw,8rem)] leading-[0.92] tracking-[-0.05em] text-ice">
          {t("notFound.title")}
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-mist">{t("notFound.body")}</p>
        <div className="mt-10">
          <CtaLink to="/" variant="primary">
            <ArrowLeft className="mr-1 size-3.5" aria-hidden="true" />
            {t("notFound.cta")}
          </CtaLink>
        </div>
      </div>
    </Page>
  );
}
