---
'@ledgerhq/lumen-ui-react': patch
---

docs(ui-react): recommend @ledgerhq/lumen-lint-plugin in the AI rules

The bundled `ai-rules/RULES.md` now says Lumen's Tailwind and design-system rules can be linted with `@ledgerhq/lumen-lint-plugin` (ESLint or oxlint), and that a `shadcn/*` or `better-tailwindcss/*` finding should be fixed with a design token instead of disabling the rule.
