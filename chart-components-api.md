# Chart Components API Reference

> Based on [Coinbase CDS `@coinbase/cds-web-visualization`](https://github.com/coinbase/cds/tree/master/packages/web-visualization/src/chart) source code.
> Only chart-specific props are listed. Generic layout/styling props (`alignItems`, `padding`, `className`, `style`, `styles`, `classNames`, `testID`) are omitted for clarity.

---

## Priority Legend

Each property is tagged with a priority indicator:

| Icon | Meaning |
|---|---|
| 🟢 | **Required / Core feature** -- Must have for our line chart requirements |
| 🟡 | **Might add later** -- Nice to have, not needed for initial release |
| 🔴 | **Very custom** -- Unlikely to add, edge-case or advanced customization |

### Our core requirements

- Line rendering with solid/dotted styles
- Gradient support (on line stroke and area)
- X-axis and Y-axis rendering
- Grid lines
- Point markers with click interaction
- Point labels
- Multiple styles of reference lines (solid, dotted)
- Scrubber with label on top
- Scrubber handle (onScrubberPositionChange callback)

---

## Table of Contents

1. [Shared Types](#1-shared-types)
2. [CartesianChart](#2-cartesianchart) -- V1
3. [LineChart](#3-linechart) -- V1
4. [BarChart](#4-barchart) -- V1
5. [Line (sub-component)](#5-line-sub-component) -- V1
6. [ReferenceLine (sub-component)](#6-referenceline-sub-component) -- V1
7. [Scrubber (sub-component)](#7-scrubber-sub-component) -- V1
8. [Point (sub-component)](#8-point-sub-component) -- V2
9. [Legend (sub-component)](#9-legend-sub-component) -- V2
10. [XAxis & YAxis (sub-components)](#10-xaxis--yaxis-sub-components) -- V2

---

## 1. Shared Types

### `Series`

Represents a single data series within the chart.

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `id` | `string` | **required** | Unique identifier for this series. Used to reference the series in sub-components like `Line`, `Scrubber`, etc. |
| 🟢 | `data` | `Array<number \| null> \| Array<[number, number] \| null>` | `undefined` | Data array for this series. Simple numbers for single values, tuples `[baseline, value]` for ranged data (e.g. stacked bars). `null` values create gaps in the visualization. |
| 🟢 | `label` | `string` | `undefined` | Human-readable label for the series. Displayed in scrubber beacon labels and legend entries. |
| 🟢 | `color` | `string` | `undefined` | CSS color string for the series. Used as the default stroke/fill color. If `gradient` is also provided, `color` is still used for scrubber beacon labels. |
| 🟢 | `gradient` | `GradientDefinition` | `undefined` | Gradient configuration for this series. Takes precedence over `color` for chart elements (lines, bars) but not for scrubber beacon labels. See `GradientDefinition` below. |
| 🔴 | `xAxisId` | `string` | `'DEFAULT_AXIS_ID'` | ID of the x-axis this series plots against. Only relevant when `layout="horizontal"` supports multiple x-axes. |
| 🔴 | `yAxisId` | `string` | `'DEFAULT_AXIS_ID'` | ID of the y-axis this series plots against. Only relevant when `layout="vertical"` supports multiple y-axes. |
| 🟡 | `stackId` | `string` | `undefined` | Stack group identifier. Series sharing the same `stackId` are stacked on top of each other. Only applies to numeric data (not tuples). |
| 🟡 | `legendShape` | `'circle' \| 'square' \| 'squircle' \| 'pill' \| ReactNode` | `'circle'` | Shape of the legend indicator for this series. Can be a preset variant or a custom React element. |

### `LineSeries`

Extends `Series` with per-series line customization. Used in `LineChart.series`.

| | Property | Type | Default | Description |
|---|---|---|---|---|
| | _...all `Series` props_ | | | |
| 🟢 | `curve` | `ChartPathCurveType` | `'bump'` | Curve interpolation method for this specific line. See `curve` values below. |
| 🟢 | `showArea` | `boolean` | `false` | Whether to show an area fill under this specific line. |
| 🟢 | `areaType` | `'gradient' \| 'solid' \| 'dotted'` | `'gradient'` | Type of area fill for this specific line. |
| 🔴 | `areaBaseline` | `number` | `undefined` | Custom baseline value for the area. Overrides the default (bottom of drawing area). |
| 🟢 | `type` | `'solid' \| 'dotted'` | `'solid'` | Line rendering style for this specific line. |
| 🟡 | `connectNulls` | `boolean` | `false` | When `true`, draws a continuous line across `null` values instead of creating gaps. |
| 🟢 | `stroke` | `string` | series `color` | Override stroke color for this specific line. |
| 🟡 | `strokeWidth` | `number` | `2` | Override stroke width for this specific line. |
| 🟡 | `strokeOpacity` | `number` | `1` | Override stroke opacity for this specific line. |
| 🟡 | `opacity` | `number` | `1` | Overall opacity applied to the line, its area, and its points. |
| 🟢 | `points` | `boolean \| (defaults: PointBaseProps) => boolean \| null \| Partial<PointProps>` | `undefined` | Controls point rendering at data positions. `true` shows default points. A function receives default props and returns customized point props or `false` to hide. |
| 🔴 | `LineComponent` | `React.FC<LineComponentProps>` | `undefined` | Custom component to render the line path (e.g. `SolidLine`, `DottedLine`, or fully custom). |
| 🔴 | `AreaComponent` | `React.FC<AreaComponentProps>` | `undefined` | Custom component to render the area fill (e.g. `DottedArea`). |
| 🟡 | `transitions` | `{ enter?: Transition \| null; update?: Transition \| null }` | `undefined` | Animation transition config for enter and update phases on this specific line. |

### `BarSeries`

Extends `Series` with per-series bar customization. Used in `BarChart.series`.

| | Property | Type | Default | Description |
|---|---|---|---|---|
| | _...all `Series` props_ | | | |
| 🔴 | `BarComponent` | `React.FC<BarProps>` | `undefined` | Custom component to render bars for this specific series. |

### `AxisConfigProps`

Configuration for an axis (passed to `CartesianChart.xAxis` / `CartesianChart.yAxis`, or merged into `LineChart.xAxis` / `LineChart.yAxis`).

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🔴 | `id` | `string` | `'DEFAULT_AXIS_ID'` | Unique identifier for this axis. Required when using multiple axes. |
| 🟢 | `scaleType` | `'linear' \| 'log' \| 'band'` | `'linear'` (line), `'band'` (bar category axis) | Type of D3 scale to use. `'linear'` for continuous numeric data, `'log'` for logarithmic, `'band'` for categorical data. |
| 🟢 | `data` | `string[] \| number[]` | `undefined` | Explicit data for the axis. Strings provide category labels (e.g. `['Jan', 'Feb']`). Numbers provide explicit x-positions (e.g. `[1, 2, 5, 8]` for irregular spacing). |
| 🟢 | `domain` | `Partial<{ min: number; max: number }> \| (bounds: { min: number; max: number }) => { min: number; max: number }` | auto-calculated | Data-space range the axis displays. A partial object overrides specific bounds. A function receives the auto-calculated bounds (after `domainLimit` processing) and returns adjusted bounds. |
| 🟡 | `domainLimit` | `'nice' \| 'strict'` | `'nice'` for value axes, `'strict'` for category axes | How the axis domain bounds are computed. `'nice'` rounds to human-friendly values (e.g. 0-100). `'strict'` uses exact data min/max. |
| 🟡 | `range` | `Partial<{ min: number; max: number }> \| (bounds: { min: number; max: number }) => { min: number; max: number }` | auto-calculated from drawing area | Pixel-space range for axis rendering. A function receives the calculated range and returns adjusted values. Useful for adding visual padding. |
| 🟡 | `categoryPadding` | `number` | `0.1` | Padding ratio between categories for band scales (0-1, where 0.1 = 10% spacing). Only used when `scaleType` is `'band'`. |

### `GradientDefinition`

Defines a color gradient applied to lines, areas, or bars.

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `axis` | `'x' \| 'y'` | `'y'` | Which axis the gradient is mapped to. `'y'` maps colors by data value, `'x'` maps colors by data index/position. |
| 🟢 | `stops` | `GradientStop[] \| (bounds: { min: number; max: number }) => GradientStop[]` | **required** | Array of gradient stops, or a function receiving the min/max of the mapped axis data that returns stops. Each stop has `offset` (data value), `color` (CSS color), and optional `opacity` (0-1, default 1). |

**`GradientStop`**:

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `offset` | `number` | **required** | Data value at which this color applies (not a 0-1 percentage, but the actual data value). |
| 🟢 | `color` | `string` | **required** | CSS color at this stop. Colors between stops are interpolated in sRGB space. |
| 🟡 | `opacity` | `number` | `1` | Opacity at this stop. |

### `ChartInset`

Padding around the chart drawing area (outside the axes).

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `top` | `number` | `32` (vertical) / `16` (horizontal) | Top inset in pixels. |
| 🟢 | `right` | `number` | `16` (vertical) / `48` (horizontal) | Right inset in pixels. |
| 🟢 | `bottom` | `number` | `16` | Bottom inset in pixels. |
| 🟢 | `left` | `number` | `16` | Left inset in pixels. |

Can also be passed as a single `number` to apply equally to all sides.

### `ChartPathCurveType`

Curve interpolation methods for lines:

| | Value | Description |
|---|---|---|
| 🟢 | `'bump'` | Default. Smooth bump curve (d3 curveBumpX / curveBumpY). |
| 🟢 | `'linear'` | Straight lines between data points. |
| 🟡 | `'natural'` | Natural cubic spline interpolation. Produces smooth curves. |
| 🟡 | `'monotone'` | Monotone cubic interpolation. Preserves monotonicity of data. |
| 🟡 | `'step'` | Step function. Value changes at the midpoint between data points. |
| 🟡 | `'stepBefore'` | Step function. Value changes at the start of each interval. |
| 🟡 | `'stepAfter'` | Step function. Value changes at the end of each interval. |

---

## 2. CartesianChart

**Package**: `V1`
**Role**: Low-level foundation component. Renders the SVG container, manages scales, axes, layout, and the scrubber provider. Use this when you need full control (e.g. combining `<Line>`, `<Bar>`, `<XAxis>`, `<YAxis>` as children).

```tsx
import { CartesianChart } from '...'

<CartesianChart
  series={[{ id: 'prices', data: [10, 22, 29, 45] }]}
  height={250}
>
  <Line seriesId="prices" />
  <XAxis />
  <YAxis showGrid />
  <Scrubber />
</CartesianChart>
```

### Props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `series` | `Series[]` | `undefined` | Array of data series to plot. Each series has an `id`, `data`, and optional `color`, `label`, `gradient`, etc. See `Series` type above. |
| 🟡 | `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Chart orientation. `'vertical'`: bars/areas grow upward, x is the category axis. `'horizontal'`: bars/areas grow rightward, y is the category axis. |
| 🟡 | `animate` | `boolean` | `true` | Master toggle for all chart animations (enter reveal, data update morphing). When `false`, all transitions are disabled. |
| 🟢 | `xAxis` | `Partial<AxisConfigProps> \| Partial<AxisConfigProps>[]` | `undefined` | Configuration for the x-axis scale(s). Controls scale type, domain, range, data labels. Pass an array for multiple x-axes (horizontal layout only). |
| 🟢 | `yAxis` | `Partial<AxisConfigProps> \| Partial<AxisConfigProps>[]` | `undefined` | Configuration for the y-axis scale(s). Controls scale type, domain, range, data labels. Pass an array for multiple y-axes (vertical layout only). |
| 🟢 | `inset` | `number \| Partial<ChartInset>` | `{ top: 32, right: 16, bottom: 16, left: 16 }` | Padding around the drawing area, outside the axes. A single number applies to all sides. |
| 🟢 | `enableScrubbing` | `boolean` | `false` | Enables interactive scrubbing (mouse/touch/keyboard). When `true`, pointer events on the chart SVG track the nearest data index. |
| 🟢 | `onScrubberPositionChange` | `(index: number \| undefined) => void` | `undefined` | Callback fired when the scrubber position changes. Receives the data index being scrubbed, or `undefined` when scrubbing ends. |
| 🟡 | `legend` | `boolean \| ReactNode` | `false` | Controls the legend. `true` renders the default `Legend` component. A React element renders that element as the legend. `false` hides the legend. |
| 🟡 | `legendPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Position of the legend relative to the chart. |
| 🟡 | `legendAccessibilityLabel` | `string` | `'Legend'` | Accessibility label for the legend group element. |
| 🟢 | `width` | `number \| string \| ResponsiveValue` | `'100%'` | Width of the chart container. |
| 🟢 | `height` | `number \| string \| ResponsiveValue` | `'100%'` | Height of the chart container. |
| 🟡 | `accessibilityLabel` | `string` | `undefined` | Accessibility label (`aria-label`) for the chart SVG element. Provides an overview description for screen readers. |
| 🟢 | `children` | `ReactNode` | `undefined` | Sub-components to render inside the chart SVG: `<Line>`, `<XAxis>`, `<YAxis>`, `<Scrubber>`, `<ReferenceLine>`, `<Point>`, etc. |

---

## 3. LineChart

**Package**: `V1`
**Role**: High-level wrapper around `CartesianChart` for standard line charts. Automatically renders `<Line>` for each series and optional `<XAxis>` / `<YAxis>`. Supports a single x/y axis pair.

```tsx
import { LineChart, Scrubber } from '...'

<LineChart
  enableScrubbing
  showArea
  height={250}
  series={[
    { id: 'prices', data: [10, 22, 29, 45, 98, 45], color: 'blue' },
  ]}
  xAxis={{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] }}
  yAxis={{ showGrid: true }}
  showXAxis
  showYAxis
>
  <Scrubber />
</LineChart>
```

### Props

Inherits all `CartesianChart` props (except `xAxis`/`yAxis` which are simplified) plus line-specific props.

#### Chart-level line defaults

These props set defaults for **all** lines. Individual series can override them via `LineSeries` properties.

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `series` | `LineSeries[]` | `undefined` | Array of line series. Each extends `Series` with per-line customization (curve, showArea, type, etc.). See `LineSeries` above. |
| 🟡 | `showArea` | `boolean` | `false` | Show area fill under all lines (unless overridden per series). |
| 🟡 | `areaType` | `'gradient' \| 'solid' \| 'dotted'` | `'gradient'` | Type of area fill for all lines. `'gradient'` fades to transparent, `'solid'` is a flat fill, `'dotted'` uses a dot pattern. |
| 🟢 | `curve` | `ChartPathCurveType` | `'bump'` | Curve interpolation method for all lines. See `ChartPathCurveType` values. |
| 🟢 | `type` | `'solid' \| 'dotted'` | `'solid'` | Line rendering style for all lines. `'solid'` draws a continuous stroke, `'dotted'` draws dots along the path. |
| 🟢 | `points` | `boolean \| (defaults: PointBaseProps) => ...` | `undefined` | Controls point rendering at data positions for all lines. |
| 🟢 | `strokeWidth` | `number` | `2` | Stroke width for all lines. |
| 🟡 | `strokeOpacity` | `number` | `1` | Stroke opacity for all lines. |
| 🟡 | `opacity` | `number` | `1` | Overall opacity for all lines (stroke + area + points). |
| 🟡 | `connectNulls` | `boolean` | `false` | When `true`, all lines draw continuously across `null` values. |
| 🔴 | `LineComponent` | `React.FC<LineComponentProps>` | `undefined` | Custom component to render all line paths. |
| 🔴 | `AreaComponent` | `React.FC<AreaComponentProps>` | `undefined` | Custom component to render all area fills. |
| 🟡 | `transitions` | `{ enter?: Transition \| null; update?: Transition \| null }` | `undefined` | Animation config for all lines. `enter` controls the initial clip-path reveal. `update` controls data-change morphing. Set either to `null` to disable that phase. |
| 🟢 | `onPointClick` | `(event, point: { x, y, dataX, dataY }) => void` | `undefined` | Click handler for points rendered via the `points` prop. |

#### Axis convenience props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `showXAxis` | `boolean` | `false` | Whether to render the x-axis. The axis uses settings from `xAxis`. |
| 🟢 | `showYAxis` | `boolean` | `false` | Whether to render the y-axis. The axis uses settings from `yAxis`. |
| 🟢 | `xAxis` | `Partial<AxisConfigProps> & XAxisProps` | `undefined` | Merged configuration for the x-axis. Includes both scale config (`scaleType`, `data`, `domain`, `range`, `domainLimit`) and visual props (`showGrid`, `showLine`, `showTickMarks`, `tickLabelFormatter`, etc.). See `XAxis` props below. |
| 🟢 | `yAxis` | `Partial<AxisConfigProps> & YAxisProps` | `undefined` | Merged configuration for the y-axis. Same merge of scale config + visual props. See `YAxis` props below. |

#### Inherited from CartesianChart

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟡 | `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Chart orientation. |
| 🟡 | `animate` | `boolean` | `true` | Enable/disable all animations. |
| 🟢 | `inset` | `number \| Partial<ChartInset>` | default inset | Padding around the drawing area. |
| 🟢 | `enableScrubbing` | `boolean` | `false` | Enable interactive scrubbing. |
| 🟢 | `onScrubberPositionChange` | `(index \| undefined) => void` | `undefined` | Scrubber position change callback. |
| 🟡 | `legend` | `boolean \| ReactNode` | `false` | Show/customize the legend. |
| 🟡 | `legendPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Legend position. |
| 🟡 | `legendAccessibilityLabel` | `string` | `'Legend'` | Legend accessibility label. |
| 🟢 | `width` | `number \| string \| ResponsiveValue` | `'100%'` | Chart width. |
| 🟢 | `height` | `number \| string \| ResponsiveValue` | `'100%'` | Chart height. |
| 🟡 | `accessibilityLabel` | `string` | `undefined` | Accessibility label for the chart. |
| 🟢 | `children` | `ReactNode` | `undefined` | Additional sub-components (`<Scrubber>`, `<ReferenceLine>`, `<Point>`, etc.). |

---

## 4. BarChart

**Package**: `V1`
**Role**: High-level wrapper around `CartesianChart` for standard bar charts. Automatically renders `<BarPlot>` for all series and optional `<XAxis>` / `<YAxis>`. Supports grouped, stacked, horizontal, and vertical bar layouts.

> **Note**: BarChart is a separate high-level component. Our core line-chart requirements do not include bars, so the entire BarChart component is 🟡 **might add later**.

```tsx
import { BarChart } from '...'

<BarChart
  height={250}
  series={[
    { id: 'revenue', data: [100, 200, 150, 300], label: 'Revenue', color: 'green' },
    { id: 'cost', data: [80, 120, 100, 180], label: 'Cost', color: 'red' },
  ]}
  xAxis={{ data: ['Q1', 'Q2', 'Q3', 'Q4'] }}
  showXAxis
  showYAxis
  stacked
/>
```

### Props

Inherits all `CartesianChart` props (except `xAxis`/`yAxis` which are simplified) plus bar-specific props.

#### Bar-specific props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟡 | `series` | `BarSeries[]` | `undefined` | Array of bar series. Each extends `Series` with an optional `BarComponent` for per-series customization. |
| 🟡 | `stacked` | `boolean` | `false` | When `true`, all series are stacked on top of each other (auto-assigns a shared `stackId`). Only applies to numeric data (not tuple data). |
| 🟡 | `barPadding` | `number` | `0.1` | Padding ratio between bars within a category group (0-1). `0.1` means 10% of available space is padding. |
| 🟡 | `borderRadius` | `number` | `4` | Corner radius for bar rectangles (in pixels). |
| 🟡 | `fillOpacity` | `number` | `undefined` | Default fill opacity for all bars. |
| 🟡 | `stroke` | `string` | `undefined` | Default stroke color for all bars. |
| 🟡 | `strokeWidth` | `number` | `undefined` | Default stroke width for all bars. |
| 🔴 | `roundBaseline` | `boolean` | `false` | Whether to also round the baseline corners of bars (where value is 0). By default only the value-end corners are rounded. |
| 🔴 | `stackGap` | `number` | `undefined` | Gap in pixels between stacked bars within a single stack. |
| 🔴 | `barMinSize` | `number` | `undefined` | Minimum rendered size (height/width) for individual bars, even if the data value would produce a smaller bar. |
| 🔴 | `stackMinSize` | `number` | `undefined` | Minimum rendered size for the entire stack. |
| 🔴 | `BarComponent` | `React.FC<BarProps>` | `DefaultBar` | Custom component to render individual bar rectangles. |
| 🔴 | `BarStackComponent` | `React.FC<BarStackComponentProps>` | `DefaultBarStack` | Custom component to render the stack container (can add clip paths, outlines, etc.). |
| 🟡 | `transitions` | `{ enter?: Transition \| null; update?: Transition \| null }` | `undefined` | Animation config for bar enter and update transitions. |

#### Axis convenience props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟡 | `showXAxis` | `boolean` | `false` | Whether to render the x-axis. |
| 🟡 | `showYAxis` | `boolean` | `false` | Whether to render the y-axis. |
| 🟡 | `xAxis` | `Partial<AxisConfigProps> & XAxisProps` | `{ scaleType: 'band' }` (vertical) / `{ scaleType: 'linear' }` (horizontal) | Merged x-axis configuration. For vertical bar charts the x-axis defaults to band scale. |
| 🟡 | `yAxis` | `Partial<AxisConfigProps> & YAxisProps` | `{ scaleType: 'linear', domain: { min: 0 } }` (vertical) / `{ scaleType: 'band' }` (horizontal) | Merged y-axis configuration. For vertical bar charts the y-axis defaults to linear with min 0. |

#### Inherited from CartesianChart

Same as LineChart: `layout`, `animate`, `inset`, `enableScrubbing`, `onScrubberPositionChange`, `legend`, `legendPosition`, `legendAccessibilityLabel`, `width`, `height`, `accessibilityLabel`, `children`.

---

## 5. Line (sub-component)

**Package**: `V1` (used inside `CartesianChart`)
**Role**: Renders a single line path for one series. Used as a child of `CartesianChart` when you need granular control. `LineChart` automatically creates one `<Line>` per series.

```tsx
<CartesianChart series={[{ id: 'prices', data: [10, 22, 29, 45] }]} height={250}>
  <Line seriesId="prices" curve="natural" showArea strokeWidth={3} />
</CartesianChart>
```

### Props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `seriesId` | `string` | **required** | ID of the series (from the parent chart's `series` array) to render as a line. |
| 🟢 | `curve` | `ChartPathCurveType` | `'bump'` | Curve interpolation method. See `ChartPathCurveType` values. |
| 🟢 | `type` | `'solid' \| 'dotted'` | `'solid'` | Line style. `'solid'` renders a continuous stroke. `'dotted'` renders evenly spaced dots along the path. |
| 🟡 | `showArea` | `boolean` | `false` | Whether to render an area fill under the line, extending down to the bottom of the drawing area (or to `areaBaseline`). |
| 🟡 | `areaType` | `'gradient' \| 'solid' \| 'dotted'` | `'gradient'` | Type of area fill. `'gradient'` fades from the line color to transparent. `'solid'` is a flat color fill. `'dotted'` uses a dot pattern. |
| 🔴 | `areaBaseline` | `number` | `undefined` | Custom data-value baseline for the area fill. When set, the area extends from the line to this value rather than to the axis edge. |
| 🟢 | `stroke` | `string` | series `color` or `'var(--color-fgPrimary)'` | Stroke color of the line. |
| 🟢 | `strokeWidth` | `number` | `2` | Width of the line stroke in pixels. |
| 🟡 | `strokeOpacity` | `number` | `1` | Opacity of the line stroke (0-1). When combined with a gradient, both are applied. |
| 🟡 | `opacity` | `number` | `1` | Overall opacity applied to the line, its area fill, and its points. |
| 🟢 | `gradient` | `GradientDefinition` | series `gradient` | Gradient configuration for the line stroke. Creates gradient or threshold-based coloring along the line. |
| 🟡 | `connectNulls` | `boolean` | `false` | When `true`, draws a continuous line across `null` data values instead of creating gaps. |
| 🟢 | `points` | `boolean \| (defaults: PointBaseProps) => boolean \| null \| Partial<PointProps>` | `undefined` | Controls rendering of data point markers. `true` shows default points at every non-null data position. A function allows per-point customization. |
| 🟢 | `onPointClick` | `(event, point: { x, y, dataX, dataY }) => void` | `undefined` | Click handler for points rendered via the `points` prop. Receives the click event and both pixel and data coordinates. |
| 🟡 | `animate` | `boolean` | chart's `animate` value | Overrides the chart-level animation setting for this specific line. |
| 🔴 | `LineComponent` | `React.FC<LineComponentProps>` | `SolidLine` or `DottedLine` (based on `type`) | Custom component to render the SVG path. Receives the computed `d` path string and styling props. |
| 🔴 | `AreaComponent` | `React.FC<AreaComponentProps>` | default area | Custom component to render the area fill (e.g. `DottedArea` for dot-pattern areas). |
| 🟡 | `transitions` | `{ enter?: Transition \| null; update?: Transition \| null }` | `undefined` | Animation transition config. `enter` controls the initial clip-path reveal animation. `update` controls data-change morphing. Set to `null` to disable. |

---

## 6. ReferenceLine (sub-component)

**Package**: `V1`
**Role**: Renders a horizontal or vertical reference line at a specific data value. Used to highlight thresholds, targets, or specific x/y positions.

```tsx
<LineChart series={[...]} height={250}>
  {/* Horizontal reference line at y=50 */}
  <ReferenceLine dataY={50} label="Target" stroke="red" />

  {/* Vertical reference line at x index 3 */}
  <ReferenceLine dataX={3} label="Today" />
</LineChart>
```

### Props (Horizontal -- `dataY`)

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `dataY` | `number` | **required** | Y-axis data value where the horizontal line is drawn. The line spans the full width of the drawing area at this value. |
| 🔴 | `yAxisId` | `string` | `'DEFAULT_AXIS_ID'` | ID of the y-axis to use for positioning (when multiple y-axes exist). |
| 🟢 | `labelPosition` | `'left' \| 'center' \| 'right'` | `'right'` | Horizontal position of the label along the reference line. |

### Props (Vertical -- `dataX`)

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `dataX` | `number` | **required** | X-axis data value (or index) where the vertical line is drawn. The line spans the full height of the drawing area at this value. |
| 🟢 | `labelPosition` | `'top' \| 'middle' \| 'bottom'` | `'top'` | Vertical position of the label along the reference line. |

### Shared Props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `label` | `string \| ReactNode` | `undefined` | Text content displayed near the reference line. Can be a simple string or rich JSX (e.g. `<tspan>` elements for styled text). |
| 🟢 | `stroke` | `string` | `'var(--color-bgLine)'` | Color of the reference line. |
| 🟡 | `opacity` | `number` | `1` | Opacity applied to both the line and the label. |
| 🟢 | `LineComponent` | `React.FC<LineComponentProps>` | `DottedLine` | Custom component to render the line path. Use `SolidLine` for a solid reference line. Supports multiple styles as required. |
| 🔴 | `LabelComponent` | `React.FC<ReferenceLineLabelComponentProps>` | `DefaultReferenceLineLabel` | Custom component to render the label. |
| 🟡 | `labelElevated` | `boolean` | `false` | When `true`, the label gets a subtle elevation/shadow and automatic bounds to stay within the chart area. |
| 🟡 | `labelFont` | `string` | `undefined` | Font style token for the label text. |
| 🟡 | `labelDx` | `number` | `undefined` | Horizontal pixel offset for the label. |
| 🟡 | `labelDy` | `number` | `undefined` | Vertical pixel offset for the label. |
| 🟡 | `labelHorizontalAlignment` | `'left' \| 'center' \| 'right'` | `undefined` | Horizontal text alignment of the label. |
| 🟡 | `labelVerticalAlignment` | `'top' \| 'middle' \| 'bottom'` | `undefined` | Vertical text alignment of the label. |
| 🔴 | `labelBoundsInset` | `number \| ChartInset` | `{ top: 4, bottom: 20, left: 12, right: 12 }` when `labelElevated` | Inset bounds to prevent the label from being clipped at chart edges. |

---

## 7. Scrubber (sub-component)

**Package**: `V1`
**Role**: Renders the interactive scrubber UI: a vertical (or horizontal) line at the current scrub position, beacon dots on each series at that position, and optional labels. Requires `enableScrubbing` on the parent chart.

```tsx
<LineChart enableScrubbing series={[...]} height={250}>
  <Scrubber
    accessibilityLabel={(index) => `Price at position ${index}`}
    label={(index) => `$${data[index]}`}
  />
</LineChart>
```

### Props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟡 | `seriesIds` | `string[]` | all series | Array of series IDs to show scrubber beacons for. By default, beacons appear on all series. |
| 🟡 | `hideOverlay` | `boolean` | `false` | Hides the semi-transparent overlay that obscures data beyond the scrubber position. |
| 🟡 | `overlayOffset` | `number` | `2` | Pixel offset of the overlay edge relative to the scrubber position. Useful when scrubbing over thick lines to prevent partial visibility. |
| 🟡 | `hideLine` | `boolean` | `false` | Hides the vertical/horizontal reference line of the scrubber. Also hides the line label. |
| 🟡 | `hideBeaconLabels` | `boolean` | `false` (vertical), `true` (horizontal) | Hides the series-name labels next to each beacon dot. In horizontal layout, beacon labels are always hidden. |
| 🟡 | `idlePulse` | `boolean` | `false` | When `true`, the scrubber beacon(s) pulse with a subtle animation while at rest (not actively scrubbing). |
| 🟢 | `label` | `string \| ReactNode \| (dataIndex: number) => string \| ReactNode` | `undefined` | Label displayed above the scrubber line. Can be static or a function receiving the current data index. Useful for showing formatted values (e.g. price + date). |
| 🟡 | `labelElevated` | `boolean` | `false` | When `true`, the scrubber line label gets elevation/shadow styling. |
| 🟡 | `labelFont` | `string` | `undefined` | Font style token for the scrubber line label. |
| 🔴 | `labelBoundsInset` | `number \| ChartInset` | auto when `labelElevated` | Inset bounds to prevent the line label from clipping at chart edges. |
| 🟡 | `accessibilityLabel` | `string \| (dataIndex: number) => string` | `undefined` | Screen-reader description of the current scrubber position. A function receives the current data index and should return a descriptive string. If not provided, falls back to `label` if it resolves to a string. |
| 🟡 | `lineStroke` | `string` | `undefined` | Stroke color for the scrubber vertical/horizontal line. |
| 🟡 | `beaconStroke` | `string` | `'var(--color-bg)'` | Stroke color for the beacon dot outer ring. |
| 🔴 | `beaconLabelMinGap` | `number` | `undefined` | Minimum pixel gap between beacon labels to prevent overlap when multiple series are close together. |
| 🔴 | `beaconLabelHorizontalOffset` | `number` | `undefined` | Horizontal pixel offset for beacon labels from their beacon position. |
| 🔴 | `beaconLabelPreferredSide` | `'left' \| 'right'` | `'right'` | Preferred side for beacon labels. Labels switch to the opposite side if there is not enough space. |
| 🔴 | `beaconLabelFont` | `string` | `undefined` | Font style token for the beacon labels. |
| 🔴 | `BeaconComponent` | `React.FC<ScrubberBeaconProps>` | `DefaultScrubberBeacon` | Custom component to render each beacon dot. |
| 🔴 | `BeaconLabelComponent` | `React.FC<ScrubberBeaconLabelProps>` | `undefined` | Custom component to render beacon labels. |
| 🔴 | `LineComponent` | `React.FC<LineComponentProps>` | `undefined` | Custom component for the scrubber reference line (e.g. `SolidLine` instead of the default dotted). |
| 🔴 | `LabelComponent` | `React.FC<ScrubberLabelProps>` | `DefaultScrubberLabel` | Custom component to render the main scrubber label above the line. |
| 🟡 | `transitions` | `{ enter?: Transition \| null; update?: Transition \| null; pulse?: Transition; pulseRepeatDelay?: number }` | `undefined` | Animation config for the scrubber beacons. `enter` = initial appearance. `update` = position changes. `pulse` = idle pulse animation (default: 1.6s ease). `pulseRepeatDelay` = seconds between pulses (default: 0.4). |

### Ref (imperative handle)

| | Method | Description |
|---|---|---|
| 🟡 | `pulse()` | Programmatically triggers a single pulse animation on the beacon(s). Useful for live-updating charts to draw attention to new data. |

> **Note**: The scrubber position change callback (`onScrubberPositionChange`) is a 🟢 core feature, but it lives on the parent `CartesianChart`/`LineChart`, not on the `Scrubber` sub-component itself.

---

## 8. Point (sub-component)

**Package**: `V2`
**Role**: Renders a single data point marker (circle) at a specific data coordinate. Automatically projects data values to pixel positions using the chart scales. Supports click interaction, labels, and animation.

```tsx
<LineChart series={[...]} height={250}>
  <Point dataX={4} dataY={98} label="$98" labelPosition="top" onClick={handleClick} />
  <Point dataX={9} dataY={4} label="$4" labelPosition="bottom" />
</LineChart>
```

### Props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟢 | `dataX` | `number` | **required** | X coordinate in data space (not pixels). For line charts, this is typically the data index. The chart scale converts this to pixel position. |
| 🟢 | `dataY` | `number` | **required** | Y coordinate in data space (not pixels). The chart scale converts this to pixel position. |
| 🔴 | `xAxisId` | `string` | first x-axis | ID of the x-axis to use for positioning. Only needed with multiple x-axes. |
| 🔴 | `yAxisId` | `string` | first y-axis | ID of the y-axis to use for positioning. Only needed with multiple y-axes. |
| 🟢 | `fill` | `string` | `'var(--color-fgPrimary)'` | Fill color of the point circle. |
| 🟡 | `radius` | `number` | `5` | Radius of the point circle in pixels. |
| 🟢 | `stroke` | `string` | `'var(--color-bg)'` | Color of the outer stroke ring around the point. |
| 🟡 | `strokeWidth` | `number` | `2` | Width of the outer stroke ring. Set to `0` to remove the stroke. |
| 🟡 | `opacity` | `number` | `undefined` | Opacity of the point (0-1). |
| 🟢 | `label` | `string \| ReactNode` | `undefined` | Text label displayed at the point position. |
| 🟢 | `labelPosition` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'center'` | `'center'` | Position of the label relative to the point. |
| 🟡 | `labelOffset` | `number` | `2 * radius` | Distance in pixels between the point and the label. |
| 🟡 | `labelFont` | `string` | `undefined` | Font style token for the label text. |
| 🔴 | `LabelComponent` | `React.FC<PointLabelProps>` | `DefaultPointLabel` | Custom component to render the label. |
| 🟢 | `onClick` | `(event, point: { x, y, dataX, dataY }) => void` | `undefined` | Click handler. When provided, the point becomes focusable and interactive (cursor changes to pointer, hover/press animations activate). |
| 🟡 | `accessibilityLabel` | `string` | auto-generated from coordinates | Screen-reader description of the point. |
| 🟡 | `animate` | `boolean` | chart's `animate` value | Override the chart-level animation setting for this specific point. |
| 🟡 | `transitions` | `{ enter?: Transition \| null; update?: Transition \| null }` | `undefined` | Animation config. `enter` controls the initial appearance. `update` controls position change animations. |

---

## 9. Legend (sub-component)

**Package**: `V2`
**Role**: Renders a legend showing series labels with colored shapes. Automatically reads series data from the chart context. Can be used standalone inside `CartesianChart` or activated via the `legend` prop on `LineChart`/`BarChart`.

> **Note**: The entire Legend component is 🟡 **might add later**. It is not part of the core line-chart requirements.

```tsx
{/* Via the legend prop (easiest) */}
<LineChart
  legend
  legendPosition="right"
  legendAccessibilityLabel="Chart legend"
  series={[
    { id: 'a', data: [...], label: 'Page Views', color: 'green' },
    { id: 'b', data: [...], label: 'Visitors', color: 'purple' },
  ]}
/>

{/* Or as a standalone child */}
<CartesianChart series={[...]}>
  <Legend flexDirection="column" />
</CartesianChart>
```

### Props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟡 | `seriesIds` | `string[]` | all series | Array of series IDs to display in the legend. By default all series with labels are shown. |
| 🟡 | `accessibilityLabel` | `string` | `'Legend'` | Accessibility label for the legend group. |
| 🟡 | `flexDirection` | `'row' \| 'column'` | `'row'` | Layout direction of legend entries. `'row'` for horizontal, `'column'` for vertical. |
| 🔴 | `EntryComponent` | `React.FC<LegendEntryProps>` | `DefaultLegendEntry` | Custom component to render each legend entry (shape + label pair). |
| 🔴 | `ShapeComponent` | `React.FC<LegendShapeProps>` | `DefaultLegendShape` | Custom component to render the colored shape within each entry. |

### `LegendEntryProps`

Props received by each legend entry component.

| | Property | Type | Description |
|---|---|---|---|
| 🟡 | `seriesId` | `string` | ID of the series this entry represents. |
| 🟡 | `label` | `ReactNode` | Label text for the series. If a ReactNode, it replaces the default Text component. |
| 🟡 | `color` | `string` | Color of the series. Defaults to `'var(--color-fgPrimary)'`. |
| 🟡 | `shape` | `LegendShape` | Shape variant or custom ReactNode for the series indicator. |
| 🔴 | `ShapeComponent` | `React.FC<LegendShapeProps>` | Component to render the shape. |

### `LegendShapeProps`

Props received by the shape component.

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🟡 | `color` | `string` | `'var(--color-fgPrimary)'` | Color of the shape. |
| 🟡 | `shape` | `'circle' \| 'square' \| 'squircle' \| 'pill' \| ReactNode` | `'circle'` | Which shape to render. |

---

## 10. XAxis & YAxis (sub-components)

**Package**: `V2`
**Role**: Render axis lines, tick marks, tick labels, grid lines, and axis labels. Used as children of `CartesianChart`, or implicitly rendered when `showXAxis`/`showYAxis` are set on `LineChart`/`BarChart`.

```tsx
<CartesianChart series={[...]} height={250}>
  <XAxis
    showGrid
    showLine
    showTickMarks
    tickLabelFormatter={(value) => `Day ${value}`}
  />
  <YAxis
    position="left"
    showGrid
    tickLabelFormatter={(value) => `$${value}`}
  />
  <Line seriesId="prices" />
</CartesianChart>
```

### XAxis Props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🔴 | `axisId` | `string` | `'DEFAULT_AXIS_ID'` | ID of the x-axis to render. Only needed when the chart has multiple x-axes (horizontal layout). |
| 🟢 | `position` | `'top' \| 'bottom'` | `'bottom'` | Position of the axis relative to the chart drawing area. |
| 🟡 | `height` | `number` | `32` (no label) / `52` (with label) | Total height of the axis area in pixels, including padding. |
| 🟢 | `showGrid` | `boolean` | `false` | Whether to render vertical grid lines at each tick position, extending across the drawing area. |
| 🟢 | `showLine` | `boolean` | `false` | Whether to render the axis baseline (a horizontal line at the axis edge). |
| 🟢 | `showTickMarks` | `boolean` | `false` | Whether to render small tick marks at each tick position. |
| 🟡 | `tickMarkSize` | `number` | `4` | Length of tick marks in pixels. |
| 🟢 | `tickLabelFormatter` | `(value: number) => string \| ReactNode` | `undefined` | Formats raw tick values into display labels. For band scales with string data and no formatter, the string labels are used automatically. |
| 🔴 | `TickLabelComponent` | `React.FC<AxisTickLabelComponentProps>` | `DefaultAxisTickLabel` | Custom component to render individual tick labels. |
| 🟡 | `requestedTickCount` | `number` | `5` for value axes | Suggested number of ticks. D3 may adjust this for nice values. Overrides `tickInterval` when set. |
| 🟡 | `ticks` | `number[] \| (value: number) => boolean` | `undefined` | Explicit tick values or a filter function. An array uses those exact positions. A function checks every data index and includes the tick if it returns `true`. |
| 🟡 | `tickInterval` | `number` | `32` | Minimum pixel spacing between ticks. Used to auto-calculate tick count based on available space. Overridden by `requestedTickCount` and `ticks`. |
| 🔴 | `tickMinStep` | `number` | `1` | Minimum step size between ticks, preventing overly dense tick generation. |
| 🔴 | `tickMaxStep` | `number` | `undefined` | Maximum step size between ticks, preventing overly sparse tick generation. |
| 🔴 | `tickMarkLabelGap` | `number` | `2` | Gap in pixels between tick marks and their labels. |
| 🔴 | `minTickLabelGap` | `number` | `4` | Minimum gap between tick labels. Labels closer than this are hidden to prevent overlap. |
| 🟡 | `label` | `string` | `undefined` | Axis title text displayed alongside the axis (e.g. "Time", "Revenue (USD)"). |
| 🔴 | `labelGap` | `number` | `4` | Gap between tick labels and the axis title. |
| 🔴 | `GridLineComponent` | `React.FC<LineComponentProps>` | `DottedLine` | Custom component to render grid lines. |
| 🔴 | `LineComponent` | `React.FC<LineComponentProps>` | `SolidLine` | Custom component to render the axis baseline. |
| 🔴 | `TickMarkLineComponent` | `React.FC<LineComponentProps>` | `SolidLine` | Custom component to render tick marks. |
| 🔴 | `bandGridLinePlacement` | `'start' \| 'middle' \| 'end' \| 'edges'` | `'edges'` | Where grid lines appear relative to each band (band scales only). `'edges'` places lines at band boundaries. |
| 🔴 | `bandTickMarkPlacement` | `'start' \| 'middle' \| 'end' \| 'edges'` | `'middle'` | Where tick marks appear relative to each band (band scales only). |

### YAxis Props

| | Property | Type | Default | Description |
|---|---|---|---|---|
| 🔴 | `axisId` | `string` | `'DEFAULT_AXIS_ID'` | ID of the y-axis to render. Only needed when the chart has multiple y-axes (vertical layout). |
| 🟢 | `position` | `'left' \| 'right'` | `'right'` | Position of the axis relative to the chart drawing area. |
| 🟡 | `width` | `number` | `44` (no label) / `64` (with label) | Total width of the axis area in pixels, including padding. |
| 🟢 | `showGrid` | `boolean` | `false` | Whether to render horizontal grid lines at each tick position, extending across the drawing area. |
| 🟢 | `showLine` | `boolean` | `false` | Whether to render the axis baseline (a vertical line at the axis edge). |
| 🟢 | `showTickMarks` | `boolean` | `false` | Whether to render small tick marks at each tick position. |
| 🟡 | `tickMarkSize` | `number` | `4` | Length of tick marks in pixels. |
| 🟢 | `tickLabelFormatter` | `(value: number) => string \| ReactNode` | `undefined` | Formats raw tick values into display labels. |
| 🔴 | `TickLabelComponent` | `React.FC<AxisTickLabelComponentProps>` | `DefaultAxisTickLabel` | Custom component to render individual tick labels. |
| 🟡 | `requestedTickCount` | `number` | `5` for value axes | Suggested number of ticks. |
| 🟡 | `ticks` | `number[] \| (value: number) => boolean` | `undefined` | Explicit tick values or a filter function. |
| 🟡 | `tickInterval` | `number` | `undefined` | Minimum pixel spacing between ticks. |
| 🔴 | `tickMinStep` | `number` | `1` | Minimum step size between ticks. |
| 🔴 | `tickMaxStep` | `number` | `undefined` | Maximum step size between ticks. |
| 🔴 | `tickMarkLabelGap` | `number` | `8` | Gap in pixels between tick marks and their labels. |
| 🔴 | `minTickLabelGap` | `number` | `0` | Minimum gap between tick labels. |
| 🟡 | `label` | `string` | `undefined` | Axis title text (rendered vertically alongside the axis). |
| 🔴 | `labelGap` | `number` | `4` | Gap between tick labels and the axis title. |
| 🔴 | `GridLineComponent` | `React.FC<LineComponentProps>` | `DottedLine` | Custom component to render grid lines. |
| 🔴 | `LineComponent` | `React.FC<LineComponentProps>` | `SolidLine` | Custom component to render the axis baseline. |
| 🔴 | `TickMarkLineComponent` | `React.FC<LineComponentProps>` | `SolidLine` | Custom component to render tick marks. |
| 🔴 | `bandGridLinePlacement` | `'start' \| 'middle' \| 'end' \| 'edges'` | `'edges'` | Where grid lines appear relative to each band (band scales only). |
| 🔴 | `bandTickMarkPlacement` | `'start' \| 'middle' \| 'end' \| 'edges'` | `'middle'` | Where tick marks appear relative to each band (band scales only). |

---

## Component Hierarchy

```
LineChart (high-level)
  └─ CartesianChart
       ├─ XAxis (if showXAxis)
       ├─ YAxis (if showYAxis)
       ├─ Line (one per series, auto-created)
       │    ├─ Area (if showArea)
       │    └─ Point[] (if points)
       ├─ ReferenceLine (user-placed children)
       ├─ Point (user-placed children)
       └─ Scrubber (user-placed child)
            ├─ Overlay rect
            ├─ ReferenceLine (scrubber line)
            ├─ Beacon dots (per series)
            └─ Beacon labels (per series)

BarChart (high-level)
  └─ CartesianChart
       ├─ XAxis (if showXAxis)
       ├─ YAxis (if showYAxis)
       ├─ BarPlot (auto-created)
       │    └─ BarStackGroup[]
       │         └─ BarStack[] (one per category)
       │              └─ Bar[] (one per series)
       └─ children (Scrubber, ReferenceLine, etc.)
```

---

## Priority Summary

### 🟢 Core feature count by component

| Component | 🟢 Core | 🟡 Later | 🔴 Skip |
|---|---|---|---|
| Series (shared type) | 5 | 2 | 2 |
| LineSeries | 5 | 5 | 3 |
| AxisConfigProps | 3 | 3 | 1 |
| GradientDefinition | 4 | 1 | 0 |
| CartesianChart | 9 | 4 | 0 |
| LineChart (own props) | 7 | 6 | 2 |
| LineChart (inherited) | 5 | 5 | 0 |
| BarChart | 0 | 10 | 5 |
| Line | 8 | 5 | 3 |
| ReferenceLine | 7 | 5 | 3 |
| Scrubber | 1 | 9 | 8 |
| Point | 8 | 5 | 3 |
| Legend | 0 | 8 | 3 |
| XAxis | 5 | 5 | 11 |
| YAxis | 5 | 5 | 11 |

---

## Ticket Mapping

| Ticket | Component(s) | Version |
|---|---|---|
| Create Chart Grid components | XAxis, YAxis (grid lines, tick marks, axis lines) | V1 |
| Create Line component | Line | V1 |
| Create ReferenceLine component | ReferenceLine | V1 |
| Create Scrubber component | Scrubber | V1 |
| Create LineChart component | LineChart | V1 |
| Create CartesianChart component | CartesianChart | V1 |
| Create Legend component | Legend | V2 |
| Create Point component | Point | V2 |
| Create xAxis & yAxis components | XAxis, YAxis (full rendering) | V2 |
