import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import type { Lang } from "./lib/localized";
import "./i18n";
import i18n from "./i18n";
import App from "./App";
import { LangSync } from "./components/system/LangSync";
import { MotionPreferenceProvider } from "./lib/motion";
import { PreviewProvider } from "./lib/preview";
import { ThemeProvider } from "./lib/theme";

export { availability } from "./lib/content";
export { arrayPattern, analyseArray, gratingLimit } from "./lib/models/array";
export {
  RESONANCE_PRESETS,
  resonanceCurve,
  resonanceMetrics,
} from "./lib/models/resonance";

export async function render(pathname: string, lang: Lang): Promise<string> {
  await i18n.changeLanguage(lang);
  return renderToString(
    <StaticRouter location={pathname}>
      <LangSync />
      <ThemeProvider>
        <PreviewProvider>
          <MotionPreferenceProvider>
            <App />
          </MotionPreferenceProvider>
        </PreviewProvider>
      </ThemeProvider>
    </StaticRouter>,
  );
}
