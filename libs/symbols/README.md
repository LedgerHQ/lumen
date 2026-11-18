# @ledgerhq/lumen-symbols

Symbols for the Lumen design system, one folder per kind and one typed module per symbol.

| Folder     | Contents                                    | Import                                   |
| ---------- | ------------------------------------------- | ---------------------------------------- |
| `lotties/` | Lottie animations, `.lottie` per appearance | `@ledgerhq/lumen-symbols/lotties/<name>` |

## Install

```bash
npm install @ledgerhq/lumen-symbols
```

## Usage

Import each symbol by its own path. There is deliberately no index re-exporting everything: bundlers that transform modules to CommonJS (Re.Pack with `@react-native/babel-preset`) can't tree-shake one, and would ship every asset.

```ts
import { star } from '@ledgerhq/lumen-symbols/lotties/star';
```

Each animation is a `{ light, dark }` pair of `.lottie` archives, so your bundler must treat `.lottie` as an asset (on Metro, add `lottie` to `resolver.assetExts`) and that rule must also cover `node_modules/@ledgerhq/lumen-symbols`.
