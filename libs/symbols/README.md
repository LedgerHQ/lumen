# @ledgerhq/lumen-symbols

Symbols for the Lumen design system, one folder per kind and one typed module per symbol.

| Folder     | Contents                | Import                                   |
| ---------- | ----------------------- | ---------------------------------------- |
| `lotties/` | Lottie animations, JSON | `@ledgerhq/lumen-symbols/lotties/<name>` |
| `types`    | Shared types            | `@ledgerhq/lumen-symbols/types`          |

## Install

```bash
npm install @ledgerhq/lumen-symbols
```

## Usage

Import each symbol by its own path. There is deliberately no index re-exporting everything: bundlers that transform modules to CommonJS (Re.Pack with `@react-native/babel-preset`) can't tree-shake one, and would ship every asset.

```ts
import { star } from '@ledgerhq/lumen-symbols/lotties/star';
```

If your bundler emits Lottie JSON as separate files rather than inlining it, make sure that rule also covers `node_modules/@ledgerhq/lumen-symbols`.
