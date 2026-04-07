# Charts Library Comparison

## Part 1 — Web (React)

Libraries: **Recharts v3**, **Victory v37**, **visx v3**, **D3.js v7**

### Feature Matrix

| Feature | Recharts v3 | Victory v37 | visx v3 | D3.js v7 |
| --- | --- | --- | --- | --- |
| **ADR weighted score (max 95)** | 65 / 95 | 64 / 95 | 64 / 95 | 69 / 95 |
| **Abstraction level** | High | Mid | Low | Lowest |
| **Bundle size (gzip)** | ~150 kB | ~120 kB | ~90 kB (tree-shake) | ~30 kB (tree-shake) |
| **POC LOC (approx.)** | ~840 | ~890 | ~930 | ~900 |
| **Weekly downloads** | 2.4 M | 445 K | 300 K | 7 M+ |
| **React Native** | No | Yes (Victory Native) | No (patterns portable) | No (math portable) |
| **TypeScript** | Full (v3 generics) | Full | Full | Full (@types/d3-*) |
| **Chart types built-in** | Line, Bar, Area, Pie, Radar… | Line, Bar, Area, Pie, Polar… | Compose from primitives | Generators only |
| **Gradient fill** | SVG defs | SVG defs | LinearGradient component | Raw SVG defs |
| **Tooltip** | Built-in + custom | VictoryTooltip + Voronoi | useTooltip + manual | Fully manual (React state) |
| **Cursor line** | Tooltip cursor prop | VoronoiContainer + onActivated | Manual SVG line | Manual SVG line |
| **Theming** | CSS vars in props | Style objects + CSS vars | CSS vars in SVG attrs | CSS vars in SVG attrs |
| **Effort to implement** | Low | Medium | High | Highest |
| **Customizability** | Medium | Medium–High | Maximum | Maximum |

### ADR Driver Breakdown

| Driver | Weight | Recharts | Victory | visx | D3 |
| --- | --- | --- | --- | --- | --- |
| Ecosystem + Community | ×3 | 5 (15) | 4 (12) | 3 (9) | 5 (15) |
| Effort Required | ×5 | 5 (25) | 3 (15) | 3 (15) | 2 (10) |
| Performances | ×3 | 3 (9) | 2 (6) | 5 (15) | 5 (15) |
| Feature Support / Extensibility | ×4 | 3 (12) | 4 (16) | 5 (20) | 5 (20) |
| API consistency across technos | ×1 | 1 (1) | 3 (3) | 2 (2) | 3 (3) |
| Compatibility (RN) | ×3 | 1 (3) | 4 (12) | 1 (3) | 2 (6) |
| **Total** | | **65** | **64** | **64** | **69** |

### Performance (Web)

| Metric | Recharts | Victory | visx | D3 |
| --- | --- | --- | --- | --- |
| Initial mount (light — 90 pts) | ~1.6 ms | ~6 ms | ~0.6 ms | ~1.0 ms |
| Initial mount (heavy — 2 000 pts) | ~1.6 ms | ~34 ms | ~2 ms | ~2 ms |
| Data swap (light) | ~9 ms | ~7 ms | ~1 ms | ~1.5 ms |
| Data swap (heavy) | ~55 ms | ~51 ms | ~6 ms | ~8 ms |
| Hover latency | ~6–8 ms | ~5 ms | ~5 ms | ~4.7 ms |

---

## Part 2 — React Native

Libraries: **Victory Native XL v41** (Skia + Reanimated), **D3 + react-native-svg**

### Feature Matrix

| Feature | Victory Native XL v41 | D3 + react-native-svg |
| --- | --- | --- |
| **Rendering engine** | @shopify/react-native-skia + Reanimated | react-native-svg |
| **Abstraction level** | Mid–High | Lowest |
| **Bundle impact** | victory-native + skia + reanimated | d3-scale + d3-shape + react-native-svg |
| **POC LOC (approx.)** | ~760 | ~742 |
| **Chart types built-in** | CartesianChart + Line, Area, Bar, Scatter | None — manual SVG rendering |
| **Gradient fill** | Built-in `<Area>` gradient | `<LinearGradient>` in react-native-svg `<Defs>` |
| **Tooltip / Cursor** | Manual via PanResponder overlay | Manual via PanResponder overlay |
| **Reference lines** | Manual SVG `<Line>` elements | Manual SVG `<Line>` elements |
| **Value labels** | Manual SVG `<Text>` elements | Manual SVG `<Text>` elements |
| **Markers** | Manual SVG `<Circle>` elements | Manual SVG `<Circle>` elements |
| **Null / gap handling** | connectNulls via data splitting | lineDataRuns splitting |
| **Gesture scrubbing** | PanResponder + state | PanResponder + state |
| **Dim-after-cursor** | clipPath on SVG `<G>` | clipPath on SVG `<G>` |
| **60 fps animations** | Yes (Skia + Reanimated) | No (JS-thread driven) |
| **TypeScript** | Full | Full (@types/d3-*) |
| **Shared code with Web** | Concepts only (different API) | Shared math, utils, and types |
| **Native dependencies** | react-native-skia, react-native-reanimated | react-native-svg |
| **Effort to implement** | Medium | High |
| **Customizability** | Medium–High (within CartesianChart) | Maximum |

### ADR Driver Breakdown

| Driver | Weight | Victory Native XL | D3 + react-native-svg |
| --- | --- | --- | --- |
| Ecosystem + Community | ×3 | 4 (12) | 5 (15) |
| Effort Required | ×5 | 4 (20) | 2 (10) |
| Performances | ×3 | 4 (12) | 3 (9) |
| Feature Support / Extensibility | ×4 | 3 (12) | 5 (20) |
| API consistency across technos | ×1 | 2 (2) | 4 (4) |
| Compatibility (Web) | ×3 | 3 (9) | 4 (12) |
| **Total** | | **67** | **70** |

### Bundle Impact (RN)

> react-native-reanimated and react-native-svg are **excluded** from totals — both are already in the project.

| Dependency | Victory Native XL | D3 + react-native-svg |
| --- | --- | --- |
| victory-native@41.20.2 (JS) | ~408 kB | — |
| @shopify/react-native-skia@2.6.2 (native) | +6 MB iOS / +4 MB Android | — |
| @shopify/react-native-skia@2.6.2 (JS) | ~220 kB | — |
| react-native-worklets@0.5.2 (JS) | ~24 kB | — |
| d3-scale@4.0.2 (JS, minified) | — | ~47 kB |
| d3-shape@3.2.0 (JS, minified) | — | ~33 kB |
| d3-array@3.2.4 (JS, minified) | — | ~17 kB |
| ~~react-native-reanimated~~ | Already in project | Already in project |
| ~~react-native-svg~~ | Already in project | Already in project |
| **Total JS** | **~652 kB** | **~97 kB** |
| **Total native binary** | **+6 MB iOS / +4 MB Android** | **0** |

> Native binary sizes from [Skia official docs](https://shopify.github.io/react-native-skia/docs/getting-started/bundle-size/). JS sizes from bundlephobia (minified) and npm registry (unpacked). If the project already uses Skia for other features, Victory's incremental JS cost is only ~408 kB.

### Performance (RN)

> 5 iterations per metric, charts rendered offscreen at 320×200.

| Metric | D3 (SVG) | Victory Native XL |
| --- | --- | --- |
| Initial mount (90 pts) | **3.75 ms** | 4.52 ms |
| Initial mount (500 pts) | 9.85 ms | **6.56 ms** |
| Initial mount (2 000 pts) | 32.99 ms | **19.85 ms** |
| Data swap (90 pts) | **16.63 ms** | 22.83 ms |
| Data swap (500 pts) | **17.37 ms** | 34.97 ms |
| Data swap (2 000 pts) | **41.22 ms** | 86.27 ms |

### Portability (Web ↔ RN)

| Aspect | Victory (web ↔ RN) | D3 (web ↔ RN) |
| --- | --- | --- |
| Types & utils | Shared | Shared |
| Chart curves | Separate mapping files | Shared (`getD3Curve`) |
| Rendering code | Completely different APIs | Different primitives, same structure |
| Interaction layer | VoronoiContainer vs PanResponder | onMouseMove vs PanResponder |
| Scale / domain logic | Shared | Shared |

---

## Summary

| Criterion | Best Web Option | Best RN Option |
| --- | --- | --- |
| Fastest to ship | Recharts | Victory Native XL |
| Best performance | visx or D3 | D3 + react-native-svg |
| Most customizable | D3 or visx | D3 + react-native-svg |
| Best cross-platform story | D3 | D3 |
| Smallest bundle | D3 | D3 + react-native-svg |
| Richest built-in features | Recharts / Victory | Victory Native XL |
| 60 fps native animations | N/A | Victory Native XL (Skia) |
