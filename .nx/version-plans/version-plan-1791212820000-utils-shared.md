---
'@ledgerhq/lumen-utils-shared': patch
---

feat(translations): add createTranslations, a dependency-free translation layer

Returns a `TranslationsProvider` and a `useTranslations` hook backed by their own React context, with typed dot-path keys, a fallback locale and `{{placeholder}}` interpolation.
