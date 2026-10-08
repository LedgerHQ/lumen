type ThemeUtilsOptions = {
  customPrefix?: string;
  exclude?: string[];
};

export const getThemeUtilsByPrefix = (
  themeObject: Record<
    string,
    Record<string, string | number | Record<string, string | number>>
  >,
  prefix: string,
  options: ThemeUtilsOptions = {},
) => {
  const { customPrefix = '', exclude } = options;
  const themeUtils: Record<string, string> = {};
  for (const themeKey in themeObject) {
    if (
      typeof themeObject[themeKey] === 'object' &&
      themeObject[themeKey] !== null
    ) {
      for (const key in themeObject[themeKey]) {
        if (key.startsWith(prefix)) {
          const isExcluded = exclude?.some((excludePrefix) =>
            key.startsWith(excludePrefix),
          );

          if (!isExcluded) {
            const utilityName = key.substring(prefix.length).toLowerCase();
            const prefixedUtilityName = customPrefix
              ? `${customPrefix}${utilityName}`
              : utilityName;
            themeUtils[prefixedUtilityName] = `var(${key})`;
          }
        }
      }
    }
  }
  return themeUtils;
};

/**
 * Same lookup as `getThemeUtilsByPrefix`, but returns the literal token values
 * instead of `var(--…)` references. Needed where CSS forbids custom properties,
 * such as `@container` conditions.
 */
export const getThemeValuesByPrefix = (
  themeObject: Record<string, Record<string, unknown>>,
  prefix: string,
): Record<string, string> => {
  const values: Record<string, string> = {};
  for (const tokens of Object.values(themeObject)) {
    for (const [key, value] of Object.entries(tokens)) {
      if (key.startsWith(prefix) && typeof value === 'string') {
        values[key.substring(prefix.length).toLowerCase()] = value;
      }
    }
  }
  return values;
};
