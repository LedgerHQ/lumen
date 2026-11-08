---
'@ledgerhq/lumen-design-core': patch
---

feat(tailwind): ship the theme as Tailwind v4 CSS under `@ledgerhq/lumen-design-core/tailwind/*.css` (one file per preset), an opt-in alternative to `@config` that generates exactly the same classes. fix(tokens): typography breakpoints now use Lumen's px screens instead of Tailwind's default rem ones (same widths at the default 16px font size, so nothing changes for most users)
