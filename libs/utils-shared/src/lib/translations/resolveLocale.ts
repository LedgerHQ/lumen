/**
 * Maps a requested locale onto a supported one: exact match first, then its
 * base language (`fr-FR` → `fr`), then the fallback. The locale can come from
 * untyped consumer code, so any string is accepted.
 */
export const resolveLocale = <Locale extends string>(
  requestedLocale: string | undefined,
  supportedLocales: readonly Locale[],
  fallbackLocale: Locale,
): Locale => {
  if (!requestedLocale) {
    return fallbackLocale;
  }

  const normalized = requestedLocale.toLowerCase().replaceAll('_', '-');
  const findLocale = (candidate: string): Locale | undefined =>
    supportedLocales.find((locale) => locale.toLowerCase() === candidate);

  return (
    findLocale(normalized) ??
    findLocale(normalized.split('-')[0]) ??
    fallbackLocale
  );
};
