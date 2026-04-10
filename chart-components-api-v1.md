# Chart Components API -- V1 (Core Only)

> Distilled from the [full reference](./chart-components-api.md). Contains **only** the properties we will implement.

---

## Shared Types

### `Series`

```ts
type Series = {
  id: string;
  data?: Array<number | null>;
  label?: string;
  color?: string;
  gradient?: GradientDefinition;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | **required** | Unique identifier for this series. |
| `data` | `Array<number \| null>` | `undefined` | Y-values for the series. `null` creates a gap. |
| `label` | `string` | `undefined` | Human-readable label. Shown in scrubber beacon labels. |
| `color` | `string` | `undefined` | Default stroke/fill color for the series. |
| `gradient` | `GradientDefinition` | `undefined` | Gradient coloring. Takes precedence over `color` for the line/area. |

### `LineSeries`

Extends `Series` with per-line overrides. Used in `LineChart.series`.

```ts
type LineSeries = Series & {
  curve?: ChartPathCurveType;
  type?: 'solid' | 'dotted';
  stroke?: string;
  showArea?: boolean;
  areaType?: 'gradient' | 'solid' | 'dotted';
  points?: boolean | ((defaults: PointBaseProps) => boolean | null | Partial<PointProps>);
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `curve` | `ChartPathCurveType` | `'bump'` | Curve interpolation for this line. |
| `type` | `'solid' \| 'dotted'` | `'solid'` | Line style: continuous stroke or dotted. |
| `stroke` | `string` | series `color` | Override stroke color. |
| `showArea` | `boolean` | `false` | Show area fill under this line. |
| `areaType` | `'gradient' \| 'solid' \| 'dotted'` | `'gradient'` | Area fill style. |
| `points` | `boolean \| (defaults) => ...` | `undefined` | Render point markers at data positions. `true` for defaults, function for custom. |

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
| `stops` | `GradientStop[] \| (bounds) => GradientStop[]` | **required** | Color stops. `offset` is the data value (not 0-1). |

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

### `ChartPathCurveType`

```ts
type ChartPathCurveType = 'bump' | 'linear';
```

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
| `children` | `ReactNode` | `undefined` | `<Line>`, `<XAxis>`, `<YAxis>`, `<Scrubber>`, `<ReferenceLine>`, `<Point>`. |

---

### 2. LineChart

High-level wrapper. Auto-renders `<Line>` per series and optional axes.

```ts
type LineChartProps = {
  series?: LineSeries[];
  curve?: ChartPathCurveType;
  type?: 'solid' | 'dotted';
  strokeWidth?: number;
  points?: boolean | ((defaults: PointBaseProps) => ...);
  onPointClick?: (event: Event, point: { x: number; y: number; dataX: number; dataY: number }) => void;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxis?: Partial<AxisConfigProps> & XAxisProps;
  yAxis?: Partial<AxisConfigProps> & YAxisProps;
  // inherited from CartesianChart
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
| `curve` | `ChartPathCurveType` | `'bump'` | Default curve for all lines. |
| `type` | `'solid' \| 'dotted'` | `'solid'` | Default line style for all lines. |
| `strokeWidth` | `number` | `2` | Default stroke width for all lines. |
| `points` | `boolean \| (defaults) => ...` | `undefined` | Render points on all lines. |
| `onPointClick` | `(event, { x, y, dataX, dataY }) => void` | `undefined` | Click handler for line points. |
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

---

### 3. Line (sub-component)

Renders a single line path inside `CartesianChart`.

```ts
type LineProps = {
  seriesId: string;
  curve?: ChartPathCurveType;
  type?: 'solid' | 'dotted';
  stroke?: string;
  strokeWidth?: number;
  gradient?: GradientDefinition;
  points?: boolean | ((defaults: PointBaseProps) => boolean | null | Partial<PointProps>);
  onPointClick?: (event: Event, point: { x: number; y: number; dataX: number; dataY: number }) => void;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `seriesId` | `string` | **required** | ID of the series to render. |
| `curve` | `ChartPathCurveType` | `'bump'` | Curve interpolation. |
| `type` | `'solid' \| 'dotted'` | `'solid'` | Solid stroke or dotted. |
| `stroke` | `string` | series `color` | Line color. |
| `strokeWidth` | `number` | `2` | Line width in px. |
| `gradient` | `GradientDefinition` | series `gradient` | Gradient coloring on the line stroke. |
| `points` | `boolean \| (defaults) => ...` | `undefined` | Point markers at data positions. |
| `onPointClick` | `(event, { x, y, dataX, dataY }) => void` | `undefined` | Click handler for rendered points. |

---

### 4. ReferenceLine (sub-component)

Horizontal or vertical reference line at a data value.

```ts
// Horizontal
type HorizontalReferenceLineProps = {
  dataY: number;
  labelPosition?: 'left' | 'center' | 'right';
};

// Vertical
type VerticalReferenceLineProps = {
  dataX: number;
  labelPosition?: 'top' | 'middle' | 'bottom';
};

// Shared
type ReferenceLineSharedProps = {
  label?: string | ReactNode;
  stroke?: string;
  LineComponent?: React.FC<LineComponentProps>; // SolidLine | DottedLine
};

type ReferenceLineProps = (HorizontalReferenceLineProps | VerticalReferenceLineProps) & ReferenceLineSharedProps;
```

| Property | Type | Default | Description |
|---|---|---|---|
| `dataY` | `number` | -- | Y-value for a horizontal line. Mutually exclusive with `dataX`. |
| `dataX` | `number` | -- | X-value/index for a vertical line. Mutually exclusive with `dataY`. |
| `label` | `string \| ReactNode` | `undefined` | Label text near the line. |
| `labelPosition` | varies | `'right'` (horiz) / `'top'` (vert) | Where the label is placed along the line. |
| `stroke` | `string` | `'var(--color-bgLine)'` | Line color. |
| `LineComponent` | `FC<LineComponentProps>` | `DottedLine` | Swap between `SolidLine` / `DottedLine` for different styles. |

---

### 5. Scrubber (sub-component)

Interactive scrubber UI: line + beacon dots + label. Requires `enableScrubbing` on the parent.

```ts
type ScrubberProps = {
  label?: string | ReactNode | ((dataIndex: number) => string | ReactNode);
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `label` | `string \| ReactNode \| (dataIndex) => string \| ReactNode` | `undefined` | Label above the scrubber line. Function form receives the current data index for dynamic formatting. |

> The scrubber **position callback** (`onScrubberPositionChange`) lives on `CartesianChart` / `LineChart`, not here.

---

### 6. Point (sub-component)

Single data point marker with optional label and click.

```ts
type PointProps = {
  dataX: number;
  dataY: number;
  fill?: string;
  stroke?: string;
  label?: string | ReactNode;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  onClick?: (event: Event, point: { x: number; y: number; dataX: number; dataY: number }) => void;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `dataX` | `number` | **required** | X coordinate in data space. |
| `dataY` | `number` | **required** | Y coordinate in data space. |
| `fill` | `string` | `'var(--color-fgPrimary)'` | Fill color of the circle. |
| `stroke` | `string` | `'var(--color-bg)'` | Outer ring color. |
| `label` | `string \| ReactNode` | `undefined` | Text label at the point. |
| `labelPosition` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'center'` | `'center'` | Label placement relative to the point. |
| `onClick` | `(event, { x, y, dataX, dataY }) => void` | `undefined` | Click handler. Makes the point interactive. |

---

### 7. XAxis (sub-component)

Renders the horizontal axis with grid, line, ticks, and labels.

```ts
type XAxisProps = {
  position?: 'top' | 'bottom';
  showGrid?: boolean;
  showLine?: boolean;
  showTickMarks?: boolean;
  tickLabelFormatter?: (value: number) => string | ReactNode;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `position` | `'top' \| 'bottom'` | `'bottom'` | Axis position relative to chart. |
| `showGrid` | `boolean` | `false` | Render vertical grid lines. |
| `showLine` | `boolean` | `false` | Render the axis baseline. |
| `showTickMarks` | `boolean` | `false` | Render tick marks. |
| `tickLabelFormatter` | `(value) => string \| ReactNode` | `undefined` | Format tick values into labels. |

---

### 8. YAxis (sub-component)

Renders the vertical axis with grid, line, ticks, and labels.

```ts
type YAxisProps = {
  position?: 'left' | 'right';
  showGrid?: boolean;
  showLine?: boolean;
  showTickMarks?: boolean;
  tickLabelFormatter?: (value: number) => string | ReactNode;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `position` | `'left' \| 'right'` | `'right'` | Axis position relative to chart. |
| `showGrid` | `boolean` | `false` | Render horizontal grid lines. |
| `showLine` | `boolean` | `false` | Render the axis baseline. |
| `showTickMarks` | `boolean` | `false` | Render tick marks. |
| `tickLabelFormatter` | `(value) => string \| ReactNode` | `undefined` | Format tick values into labels. |

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
       └─ Scrubber (child)
```

## Ticket Mapping

| Ticket | Component(s) |
|---|---|
| Create CartesianChart component | CartesianChart |
| Create Chart Grid components | XAxis, YAxis |
| Create Line component | Line |
| Create ReferenceLine component | ReferenceLine |
| Create Scrubber component | Scrubber |
| Create LineChart component | LineChart |
| Create Point component | Point |
