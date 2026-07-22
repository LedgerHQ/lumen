---
name: react-component-patterns
description: Use when building or editing a React component in libs/ui-react — class-variance-authority (cva) usage and props-drilling conventions.
paths: libs/ui-react/**/*.tsx
---

# React component patterns (`libs/ui-react`)

Conventions for authoring React components in the UI Kit.

## class-variance-authority (cva)

- Use `cva` at the top of the file to compose classnames **when there is variant composition**.
- Use `cva` at the top of the file **when an element has many classnames** to declare.
- Otherwise, for only a few classnames, set them inline in the JSX.

## Props drilling

- Component props should be **props-drilled to the top-level element** so behaviour
  is never hidden or misleading.
- For legitimate exceptions (e.g. a nested `ref` or a nested `className`), give the
  prop a distinct name that makes the target explicit rather than overloading the
  top-level prop.
