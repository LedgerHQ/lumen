--

## Coinbase CDS Scrubber & ScrubberProvider - Architecture Deep Dive

### Overview

The Scrubber in Coinbase CDS is a **chart interaction layer** that lets users hover/touch/keyboard-navigate across a chart to inspect data points. It consists of a **context-driven provider** that tracks position, and a set of **visual components** (line, labels, overlay) that react to that position.

---

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      LineChart (public API)                    │
│  Props: data, series, scrubber?, axes?, label?, overlay?      │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │          CartesianChart (internal, not exported)          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │           CartesianChartProvider                    │  │ │
│  │  │   (series, scales, axes, drawingArea, dataLength)  │  │ │
│  │  │  ┌──────────────────────────────────────────────┐  │  │ │
│  │  │  │           ScrubberProvider                   │  │  │ │
│  │  │  │                                              │  │  │ │
│  │  │  │  Attaches to SVG element:                    │  │  │ │
│  │  │  │  ┌────────────────────────────────────────┐  │  │  │ │
│  │  │  │  │  mousemove  → getDataIndexFromPosition │  │  │  │ │
│  │  │  │  │  touchstart → getDataIndexFromPosition │  │  │  │ │
│  │  │  │  │  touchmove  → getDataIndexFromPosition │  │  │  │ │
│  │  │  │  │  keydown    → ArrowLeft/Right/Home/End │  │  │  │ │
│  │  │  │  │  mouseleave → clear position           │  │  │  │ │
│  │  │  │  │  touchend   → clear position           │  │  │  │ │
│  │  │  │  │  blur       → clear position           │  │  │  │ │
│  │  │  │  └─────────────┬──────────────────────────┘  │  │  │ │
│  │  │  │                │                             │  │  │ │
│  │  │  │     ScrubberContext.Provider                  │  │  │ │
│  │  │  │     ┌──────────▼──────────────────┐          │  │  │ │
│  │  │  │     │ • enableScrubbing: boolean  │          │  │  │ │
│  │  │  │     │ • scrubberPosition?: number │ (dataIdx)│  │  │ │
│  │  │  │     │ • onScrubberPositionChange()│          │  │  │ │
│  │  │  │     └──────────┬──────────────────┘          │  │  │ │
│  │  │  └────────────────┼────────────────────────────┘  │  │ │
│  │  │                   │                                │  │ │
│  │  │       ┌───────────▼────────────┐                   │  │ │
│  │  │       │    <Scrubber />        │  (child of chart)  │  │ │
│  │  │       │                        │                   │  │ │
│  │  │       │  ┌──────────────────┐  │                   │  │ │
│  │  │       │  │   Overlay Rect   │  │  Dims future data │  │ │
│  │  │       │  ├──────────────────┤  │                   │  │ │
│  │  │       │  │  ReferenceLine   │  │  Vertical line    │  │ │
│  │  │       │  │  + Label         │  │  + top label      │  │ │
│  │  │       │  └──────────────────┘  │                   │  │ │
│  │  │       └────────────────────────┘                   │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

> **v1 API decision:** `CartesianChart` and its provider are **internal** implementation details. Consumers only interact with `LineChart`, which configures the cartesian internals (scales, axes, series) from a declarative props API.

---

### Data Flow (step by step)

```
   User Input                Conversion               State                  Rendering
┌──────────────┐    ┌──────────────────────┐   ┌──────────────┐   ┌────────────────────────┐
│ Mouse/Touch/ │───▶│ pixel position       │──▶│ scrubber     │──▶│ Scrubber reads context  │
│ Keyboard     │    │ → scale.invert()     │   │ Position     │   │ → computes dataValue    │
│ event on SVG │    │ → nearest dataIndex  │   │ (number|     │   │ → positions line        │
│              │    │                      │   │  undefined)  │   │ → shows overlay/labels  │
│ Leave/Blur   │───▶│ → set undefined      │──▶│              │──▶│ → hides scrubber        │
└──────────────┘    └──────────────────────┘   └──────────────┘   └────────────────────────┘
```

---

### Key Components Breakdown

#### 1. `ScrubberContext` (the minimal core)

This is the **heart** of the system. It's a simple React context with just 3 fields:

```typescript
type ScrubberContextValue = {
  enableScrubbing: boolean;
  scrubberPosition?: number;          // dataIndex or undefined when idle
  onScrubberPositionChange: (index: number | undefined) => void;
};
```

**Consumed via:** `useScrubberContext()` hook.

#### 2. `ScrubberProvider` (the interaction engine)

This component does the heavy lifting of converting raw pointer events into data indices:

| Responsibility | How it works |
|---|---|
| **Mouse tracking** | `mousemove` on SVG -> `getBoundingClientRect()` -> pixel offset -> `scale.invert()` -> nearest `dataIndex` |
| **Touch support** | `touchstart`/`touchmove` with `preventDefault()` (blocks scroll while scrubbing) |
| **Keyboard navigation** | Arrow keys step +/-1 (or +/-10 with Shift), Home/End jump to extremes, Escape clears |
| **Scale-aware** | Works with both categorical (band) and continuous (linear) scales by snapping to nearest data point |
| **Layout-aware** | Respects `horizontal`/`vertical` layout - uses X for vertical charts, Y for horizontal |
| **Cleanup** | `mouseleave`, `touchend`, `touchcancel`, `blur` all reset position to `undefined` |

#### 3. `Scrubber` (the visual component)

A compound component that renders 3 optional sub-elements based on scrubber position:

| Sub-element | Purpose | Customizable via |
|---|---|---|
| **Overlay rect** | Semi-transparent rect covering data **after** scrubber position | `hideOverlay`, `styles.overlay` |
| **ReferenceLine** | Vertical (or horizontal) line at scrubber position | `hideLine`, `lineColor`, `LineComponent` |
| **Label** | Text above the reference line (e.g. "Day 5") | `label`, `labelFont`, `LabelComponent`, `labelElevated` |

---

### LineChart Public API (v1)

`LineChart` is the only chart component exposed to consumers. It wraps the internal `CartesianChart` + `CartesianChartProvider` + `ScrubberProvider` stack behind a declarative props interface. Scrubber is a **child component** passed into `LineChart`, following the Coinbase compound-component pattern.

```tsx
// Consumer usage — Scrubber is opt-in via children
<LineChart data={data} series={series}>
  <Scrubber
    label={(index) => formatDate(data[index].date)}
    hideLine={false}
    hideOverlay={false}
  />
</LineChart>
```

```typescript
type LineChartProps = {
  data: DataPoint[];
  series: SeriesConfig[];
  children?: ReactNode; // accepts <Scrubber />, etc.

  // Axes (opt-in)
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
};
```

`LineChart.Scrubber` is a namespaced sub-component that reads from `ScrubberContext` internally. Its props map directly to the scrubber visual options:

```typescript
type ScrubberProps = {
  label?: (index: number) => string;
  hideLine?: boolean;
  hideOverlay?: boolean;
  lineColor?: string; // default base
  onPositionChange?: (index: number | undefined) => void;
};
```

**What `LineChart` handles internally:**
- Creates scales from `data` + `series` config
- Sets up axes from `xAxis` / `yAxis`
- Wires the `ScrubberProvider` when a `<Scrubber />` child is present
- Manages SVG sizing, drawing area, and layout

**What consumers never see:**
- `CartesianChart`, `CartesianChartProvider` — internal composition
- Scale creation, drawing area computation — derived from props
- `ScrubberContext` — consumed internally by `LineChart.Scrubber`

---

### Minimal Integration Strategy

For our visualization libraries, the **essential extractable pieces** are:

#### Tier 1 - Context only (smallest footprint)

```typescript
// 1. The context type + provider
type ScrubberContextValue = {
  enableScrubbing: boolean;
  scrubberPosition?: number;
  onScrubberPositionChange: (index: number | undefined) => void;
};

// 2. The hook
const useScrubberContext = () => useContext(ScrubberContext);
```

This gives any child component reactive access to the current scrubber index.

#### Tier 2 - Add the interaction provider

The `ScrubberProvider` pattern to replicate:

1. Attach `mousemove`/`touchmove`/`keydown` listeners to your chart's SVG element
2. Convert pixel position to data index using your scale's `.invert()` (or nearest-neighbor for band scales)
3. Set `scrubberPosition` in context
4. Clear on `mouseleave`/`touchend`/`blur`

**Key insight:** The provider is **scale-agnostic** - it just needs any function that converts `pixel -> dataIndex`. You can adapt this to your own scale system (d3, custom, etc.).

#### Tier 3 - Add visual elements (optional, pick what you need)

| Element | Dependencies | Complexity |
|---|---|---|
| Reference line | Just needs `scrubberPosition` + x-scale | Low |
| Overlay rect | Just needs pixel position + drawing area | Low |

---

### What makes it "Coinbase-flavored" (can be stripped)

These are CDS-specific concerns you'd **not** need to bring over:

- `@coinbase/cds-common/types` - replace with your own `Rect`, `SharedProps`
- `@coinbase/cds-web` layout components - replace with your own
- CDS design tokens (`var(--color-fg)`, etc.) - replace with your tokens
- The `CartesianChartContext` dependency - internal to `LineChart`, not exposed

---

### Summary: What to take for a minimal integration

| What | Files to study | Effort |
|---|---|---|
| **Context + hook** | `utils/context.ts` (ScrubberContext part only) | ~20 lines |
| **Interaction provider** | `scrubber/ScrubberProvider.tsx` | ~150 lines to adapt |
| **Scrubber visual** | `scrubber/Scrubber.tsx` | Pick sub-elements a la carte |

The cleanest path: start with the `LineChart` shell (props → internal cartesian setup), then layer in the **context + provider** (Tier 1+2) for scrubber support. All internals stay behind the `LineChart` boundary — consumers only pass props.

---

### React Native: Gesture Handling

On React Native there are no DOM events — the `ScrubberProvider` uses react-native-gesture-handler (RNGH v2) and Reanimated shared values instead.

#### How it differs from web

| Concern | Web | React Native |
|---|---|---|
| **Activation** | Immediate on `mousemove` / `touchstart` | Long press required to enter scrubbing mode (prevents accidental activation on scroll) |
| **Move tracking** | `mousemove` / `touchmove` DOM events | `Gesture.Pan` after long press succeeds |
| **Scroll blocking** | `preventDefault()` on touch events | Explicit `scrollEnabled={false}` on ancestor `ScrollView` / `FlatList` via `isScrubbing` signal |
| **Cleanup** | `mouseleave` / `touchend` / `blur` | `State.END` / `State.CANCELLED` / `State.FAILED` |

#### Gesture composition

The scrubber uses a long-press → pan handoff so normal scrolling is never intercepted:

```typescript
const longPress = Gesture.LongPress()
  .minDuration(150)
  .onStart((e) => {
    isScrubbing.value = true;
    updatePosition(e.x);
  });

const pan = Gesture.Pan()
  .manualActivation(true)
  .onTouchesMove((e, manager) => {
    if (isScrubbing.value) manager.activate();
  })
  .onUpdate((e) => updatePosition(e.x))
  .onEnd(() => {
    isScrubbing.value = false;
    clearPosition();
  });

const composed = Gesture.Simultaneous(longPress, pan);
```

#### Scroll lock flow

While scrubbing is active, parent scrollable containers must yield control. The `ScrubberProvider` exposes an `isScrubbing` Reanimated shared value (or React context flag) that ancestors consume:

```
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐
│  Long press  │────▶│ isScrubbing=true  │────▶│ Parent ScrollView│
│  activates   │     │ (shared value)    │     │ scrollEnabled=   │
│              │     │                   │     │   !isScrubbing   │
│  Finger up / │────▶│ isScrubbing=false │────▶│ scrollEnabled=   │
│  cancel      │     │                   │     │   true           │
└──────────────┘     └───────────────────┘     └──────────────────┘
```

> **Key difference from web:** On web, `preventDefault()` on touch events is enough to block scroll. On React Native, we need explicit gesture coordination — the scrubber must signal to ancestor scrollable containers to yield control via `isScrubbing` context or a shared Reanimated value.

