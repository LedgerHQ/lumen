---
name: file-structure
description: Use when creating, naming, or placing a new file or folder — component vs utility naming and the per-responsibility file layout with a barrel.
---

# File & folder structure

Naming and layout conventions for components and utilities. Each responsibility
gets its own file; the folder's public API is exposed through an `index.ts` barrel.

## Components — PascalCase

A component lives in a PascalCase folder, one file per responsibility:

```
Button/
├── Button.tsx          # implementation
├── Button.test.tsx     # tests
├── Button.stories.tsx  # Storybook stories
├── Button.mdx          # Storybook docs
├── Button.figma.ts     # Figma Code Connect
└── index.ts            # barrel exposing the public API
```

## Utilities & hooks — camelCase

Non-component code uses a camelCase folder, split by responsibility:

```
useControllableState/
├── useControllableState.ts       # implementation
├── useControllableState.test.ts  # tests
└── index.ts                      # barrel exposing the public API
```

## Rules

- Component folders and files: **PascalCase**. Everything else: **camelCase**.
- One responsibility per file (impl / test / stories / docs / code-connect).
- Always expose the public API through `index.ts`; import from the barrel, not deep paths.
