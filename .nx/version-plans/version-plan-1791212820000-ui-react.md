---
'@ledgerhq/lumen-ui-react': patch
---

refactor(translations): replace i18next and react-i18next with createTranslations

Lumen no longer depends on `i18next` or `react-i18next`, so its strings never share state with your app's own i18n setup. The `ThemeProvider` `locale` prop and the exported `SupportedLocale` / `Languages` are unchanged.

Lumen strings now render in the `ThemeProvider` locale on the first render, and in English instead of raw keys when a component is rendered outside a `ThemeProvider`.
