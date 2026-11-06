---
'@ledgerhq/lumen-design-core': patch
---

fix(tokens): own the breakpoints in the Tailwind preset and the JS theme

The Tailwind breakpoints (`xs` 360px, `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px) are now generated from `breakpoints` in the JS theme, so web and React Native share a single definition. Breakpoint variants (`sm:`, `max-md:`, …) produce the same CSS as before.

- The responsive typography (`responsive-display-*` and the other breakpoint-dependent text styles) now switches at Lumen's breakpoints. It previously used Tailwind's default breakpoints (`40rem`, `48rem`, `64rem`, `80rem`). These match Lumen's values at the default 16px font size, but differed for users with a larger browser font size, so text and layout could change at different widths.
- The responsive typography now also has a `2xl` (1536px) step, synced from Figma's `2xl` breakpoint mode, which was previously ignored. Its values currently match `xl`.
- The responsive typography media queries are now emitted from the smallest to the largest breakpoint. `md` used to come after `lg`, so it would have overridden `lg` above 1024px if their values differed.
- A consumer config that replaces `theme.screens` no longer removes Lumen's breakpoints or brings back Tailwind's defaults. To change one of Lumen's breakpoints or add your own, use `theme.extend.screens`.
