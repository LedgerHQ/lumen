export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

/**
 * Dot-separated path to every string leaf of a dictionary, e.g.
 * `'components.dialog.closeAriaLabel'`.
 */
export type TranslationKey<Dictionary> = {
  [Key in keyof Dictionary & string]: Dictionary[Key] extends string
    ? Key
    : `${Key}.${TranslationKey<Dictionary[Key]>}`;
}[keyof Dictionary & string];

/**
 * A locale may leave keys out: they resolve through the fallback locale.
 */
export type PartialTranslationDictionary<Dictionary> = {
  [Key in keyof Dictionary]?: Dictionary[Key] extends string
    ? string
    : PartialTranslationDictionary<Dictionary[Key]>;
};

export type TranslationParams = Record<string, string | number>;

export type Translate<Dictionary> = (
  key: TranslationKey<Dictionary>,
  params?: TranslationParams,
) => string;
