export const LANGS = ["en", "zh"] as const;
export type Lang = (typeof LANGS)[number];

export type Localized<T = string> = Record<Lang, T>;

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "zh";
}

/** Shorthand for a bilingual string. */
export function l(en: string, zh: string): Localized {
  return { en, zh };
}

/** Shorthand for a bilingual list. */
export function la(en: string[], zh: string[]): Localized<string[]> {
  return { en, zh };
}

export function pickLocalized<T>(value: Localized<T>, lang: Lang): T {
  return value[lang];
}
