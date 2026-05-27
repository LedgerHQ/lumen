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
