# @ledgerhq/lumen-symbols

Asset files for the Lumen design system, one folder per kind. Files ship as-is. React, React Native bindings live in the UI libraries.

| Folder     | Contents                | Import                                        |
| ---------- | ----------------------- | --------------------------------------------- |
| `lotties/` | Lottie animations, JSON | `@ledgerhq/lumen-symbols/lotties/<name>.json` |

## Install

```bash
npm install @ledgerhq/lumen-symbols
```

## Usage

Import each file by its own path. There is deliberately no index re-exporting everything: bundlers that transform modules to CommonJS (Re.Pack with `@react-native/babel-preset`) can't tree-shake one, and would ship every asset.

```ts
import loader from '@ledgerhq/lumen-symbols/lotties/loader.json';
```

If your bundler emits Lottie JSON as separate files rather than inlining it, make sure that rule also covers `node_modules/@ledgerhq/lumen-symbols`.
