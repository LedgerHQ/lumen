# Chart Components API — V1 (Core Only)

> Merged reference. Contains **only** the properties we will implement.

---

## Shared Types

### `Series`

```ts
type Series = {
  id: string;
  data?: Array<number | null>;
  label?: string;
  stroke: string;
  gradient?: GradientDefinition;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | **required** | Unique identifier for this series. |
| `data` | `Array<number \| null>` | `undefined` | Y-values for the series. `null` creates a gap. |
| `label` | `string` | `undefined` | Human-readable label. Shown in legend and scrubber beacon labels. |
| `stroke` | `string` (HEX) | **required** | Line color. |
| `gradient` | `GradientDefinition` | `undefined` | Gradient coloring. Takes precedence over `stroke` for the line/area. |

### `LineSeries`

Extends `Series` with per-line overrides. Used in `LineChart.series`.

```ts
type LineSeries = Series & {
  showArea?: boolean;
  areaType?: null | 'gradient';
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `showArea` | `boolean` | `false` | Show area fill under this line. |
| `areaType` | `null \| 'gradient'` | `null` | Area fill style. When `'gradient'`, uses the `stroke` color. |

> **Fixed across all lines (not configurable):** curve = `'bump'`, strokeWidth = `2`, lineType = `'solid'`.

### `GradientDefinition`

```ts
type GradientDefinition = {
  axis?: 'x' | 'y';
  stops: GradientStop[] | ((bounds: { min: number; max: number }) => GradientStop[]);
};

type GradientStop = {
  offset: number;
  color: string;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `axis` | `'x' \| 'y'` | `'y'` | Axis the gradient maps to. `'y'` = by value, `'x'` = by position. |
| `stops` | `GradientStop[] \| (bounds) => GradientStop[]` | **required** | Color stops. `offset` is the data value (not 0–1). |

### `AxisConfigProps`

Scale configuration passed via `xAxis` / `yAxis` on chart components.

```ts
type AxisConfigProps = {
  scaleType?: 'linear' | 'log' | 'band';
  data?: string[] | number[];
  domain?: Partial<{ min: number; max: number }>
         | ((bounds: { min: number; max: number }) => { min: number; max: number });
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `scaleType` | `'linear' \| 'log' \| 'band'` | `'linear'` | D3 scale type. |
| `data` | `string[] \| number[]` | `undefined` | Category labels or explicit numeric positions. |
| `domain` | `Partial<{min,max}> \| (bounds) => {min,max}` | auto | Data-space range. Partial overrides specific bounds; function transforms auto-bounds. |

### `ChartInset`

```ts
type ChartInset = { top: number; right: number; bottom: number; left: number };
```

Can also be a single `number` applied to all sides.

---

## Components

### 1. CartesianChart

Low-level SVG chart container. Manages scales, axes, scrubber provider, and renders children.

```ts
type CartesianChartProps = {
  series?: Series[];
  xAxis?: Partial<AxisConfigProps>;
  yAxis?: Partial<AxisConfigProps>;
  inset?: number | Partial<ChartInset>;
  enableScrubbing?: boolean;
  onScrubberPositionChange?: (index: number | undefined) => void;
  width?: number | string;
  height?: number | string;
  children?: ReactNode;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `series` | `Series[]` | `undefined` | Data series to plot. |
| `xAxis` | `Partial<AxisConfigProps>` | `undefined` | X-axis scale configuration. |
| `yAxis` | `Partial<AxisConfigProps>` | `undefined` | Y-axis scale configuration. |
| `inset` | `number \| Partial<ChartInset>` | `{ top: 32, right: 16, bottom: 16, left: 16 }` | Padding around drawing area. |
| `enableScrubbing` | `boolean` | `false` | Enable pointer/touch/keyboard scrubbing. |
| `onScrubberPositionChange` | `(index \| undefined) => void` | `undefined` | Fires when scrubber position changes. `undefined` = scrubbing ended. |
| `width` | `number \| string` | `'100%'` | Container width. |
| `height` | `number \| string` | `'100%'` | Container height. |
| `children` | `ReactNode` | `undefined` | `<Line>`, `<XAxis>`, `<YAxis>`, `<Scrubber>`, `<ReferenceLine>`, `<Point>`, `<Legend>`. |

---

### 2. LineChart

High-level wrapper. Auto-renders `<Line>` per series and optional axes.

```ts
type LineChartProps = {
  series?: LineSeries[];
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxis?: Partial<AxisConfigProps> & XAxisProps;
  yAxis?: Partial<AxisConfigProps> & YAxisProps;
  inset?: number | Partial<ChartInset>;
  enableScrubbing?: boolean;
  onScrubberPositionChange?: (index: number | undefined) => void;
  width?: number | string;
  height?: number | string;
  children?: ReactNode;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `series` | `LineSeries[]` | `undefined` | Line series with per-series overrides. |
| `legendPosition` | `'top' \| 'right' \| 'bottom' \| 'left'` | `undefined` | Position of the legend relative to the chart. |
| `showXAxis` | `boolean` | `false` | Render the x-axis. |
| `showYAxis` | `boolean` | `false` | Render the y-axis. |
| `xAxis` | `AxisConfigProps & XAxisProps` | `undefined` | Merged x-axis config (scale + visuals). |
| `yAxis` | `AxisConfigProps & YAxisProps` | `undefined` | Merged y-axis config (scale + visuals). |
| `inset` | `number \| Partial<ChartInset>` | default | Drawing area padding. |
| `enableScrubbing` | `boolean` | `false` | Enable scrubbing interaction. |
| `onScrubberPositionChange` | `(index \| undefined) => void` | `undefined` | Scrubber position callback. |
| `width` | `number \| string` | `'100%'` | Container width. |
| `height` | `number \| string` | `'100%'` | Container height. |
| `children` | `ReactNode` | `undefined` | `<Scrubber>`, `<ReferenceLine>`, `<Point>`, etc. |

> **Fixed across all lines:** curve = `'bump'`, strokeWidth = `2`, lineType = `'solid'`.

---

### 3. Line (sub-component)

Renders a single line path inside `CartesianChart`.

```ts
type LineProps = {
  seriesId: string;
  stroke?: string;
  gradient?: GradientDefinition;
  showArea?: boolean;
  areaType?: null | 'gradient';
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `seriesId` | `string` | **required** | ID of the series to render. |
| `stroke` | `string` (HEX) | series `stroke` | Override line color. |
| `gradient` | `GradientDefinition` | series `gradient` | Gradient coloring on the line stroke. |
| `showArea` | `boolean` | `false` | Show area fill under this line. |
| `areaType` | `null \| 'gradient'` | `null` | Area fill style. When `'gradient'`, uses the `stroke` color. |

> **Fixed:** curve = `'bump'`, strokeWidth = `2`, lineType = `'solid'`.

---

### 4. ReferenceLine (sub-component)

Horizontal or vertical reference line at a data value.

```ts
type HorizontalReferenceLineProps = { dataY: number };
type VerticalReferenceLineProps  = { dataX: number };

type ReferenceLineSharedProps = {
  label?: string;
  labelPosition?: 'left' | 'right';
  stroke?: 'dotted' | 'solid';
  strokeColor?: string;
};

type ReferenceLineProps =
  (HorizontalReferenceLineProps | VerticalReferenceLineProps)
  & ReferenceLineSharedProps;
```

| Property | Type | Default | Description |
|---|---|---|---|
| `dataY` | `number` | — | Y-value for a horizontal line. Mutually exclusive with `dataX`. |
| `dataX` | `number` | — | X-value/index for a vertical line. Mutually exclusive with `dataY`. |
| `label` | `string` | `undefined` | Label text near the line. |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Where the label is placed along the line. |
| `stroke` | `'dotted' \| 'solid'` | `'dotted'` | Line style. |
| `strokeColor` | `string` (HEX) | subtle | Line color. |

---

### 5. Scrubber (sub-component)

Interactive scrubber UI: line + beacon dots + label. Requires `enableScrubbing` on the parent.

```ts
type ScrubberProps = {
  label?: ReactNode;
  line?: 'dotted' | 'solid';
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | `undefined` | Label above the scrubber line. |
| `line` | `'dotted' \| 'solid'` | TBD | Scrubber line style. |

> **Open questions:**
> - `hideOverlay` — Should the right side of the scrubber always have reduced opacity?
> - Do we want scrubber beacon, label, or both?
> - Position & style of the label.

---

### 6. Point (sub-component)

Single data point marker with optional label.

```ts
type PointProps = {
  dataX: number;
  dataY: number;
  fill?: string;
  label?: string | ReactNode;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  strokeWidth?: number;
  size?: number;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `dataX` | `number` | **required** | X coordinate in data space. |
| `dataY` | `number` | **required** | Y coordinate in data space. |
| `fill` | `string` (HEX) | line color | Fill color of the circle. |
| `label` | `string \| ReactNode` | `undefined` | Text label at the point. |
| `labelPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | TBD | Label placement relative to the point. |
| `strokeWidth` | `number` | TBD | Ring/space width around the point. |
| `size` | `number` | TBD | Point size. |

> **Open:** Decide defaults for `strokeWidth` and `size`, or simplify to a single size variant (`sm` / `md` / `lg`).

---

### 7. XAxis (sub-component)

Renders the horizontal axis with grid, line, and ticks.

```ts
type XAxisProps = {
  position?: 'top' | 'bottom';
  showGrid?: boolean;
  showLine?: boolean;
  showTickMark?: boolean;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `position` | `'top' \| 'bottom'` | `'bottom'` | Axis position relative to chart. |
| `showGrid` | `boolean` | `false` | Render vertical grid lines. |
| `showLine` | `boolean` | `false` | Render the axis baseline. |
| `showTickMark` | `boolean` | `false` | Render tick marks. |

---

### 8. YAxis (sub-component)

Renders the vertical axis with grid, line, and ticks.

```ts
type YAxisProps = {
  position?: 'left' | 'right';
  showGrid?: boolean;
  showLine?: boolean;
  showTickMark?: boolean;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `position` | `'left' \| 'right'` | `'left'` | Axis position relative to chart. |
| `showGrid` | `boolean` | `false` | Render horizontal grid lines. |
| `showLine` | `boolean` | `false` | Render the axis baseline. |
| `showTickMark` | `boolean` | `false` | Render tick marks. |

---

### 9. Legend (sub-component)

Displays series labels with color indicators.

```ts
type LegendProps = {
  direction?: 'row' | 'column';
  shape?: string;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `direction` | `'row' \| 'column'` | TBD | Layout direction of legend items. |
| `shape` | `string` | TBD | Shape rendered before each legend label. |

> **Open:** Define available shape values (e.g. `'circle'`, `'square'`, `'line'`).

---

## Component Tree

```
LineChart
  └─ CartesianChart
       ├─ XAxis
       ├─ YAxis
       ├─ Line (per series)
       ├─ ReferenceLine (children)
       ├─ Point (children)
       ├─ Scrubber (child)
       └─ Legend (child)
```
