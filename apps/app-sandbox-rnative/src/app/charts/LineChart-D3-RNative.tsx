import { scaleLinear, scaleTime } from 'd3-scale';
import { area, line } from 'd3-shape';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { getD3Curve } from './chartCurves';
import type { DataPoint, LineChartProps, MarkerConfig } from './types';
import {
  GRID_LINE_STROKE,
  GRID_LINE_STROKE_DASHARRAY,
  REFERENCE_LINE_STROKE,
  buildEvenlySpacedTicks,
  computeXTimeDomainMs,
  computeYDomain,
  effectiveShowXAxis,
  effectiveShowYAxis,
  ensureDomainBoundaryTicks,
  getRefLineStrokeDasharray,
  getReferenceLineStrokeWidth,
  getSeriesLabel,
  lineDataRuns,
  nearestDefinedPointByTime,
  resolveChartInset,
  resolveGridVisibility,
  resolveSeries,
  resolveValueLabels,
} from './utils';

type TooltipEntry = {
  lineId: string;
  lineLabel: string;
  point: DataPoint;
  color: string;
};

type SvgPressEvent = {
  nativeEvent: {
    locationX: number;
    locationY: number;
  };
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const DEFAULT_AXIS_COLOR = '#94a3b8';
const DEFAULT_TEXT_COLOR = '#e2e8f0';
const DEFAULT_TOOLTIP_BACKGROUND = '#0f172a';
const DEFAULT_TOOLTIP_BORDER = '#334155';

export const LineChartD3RNative = (props: LineChartProps) => {
  const lines = resolveSeries(props);
  const {
    width,
    height,
    enableScrubbing = true,
    showTooltip: showTooltipProp = true,
    showCursor = true,
    showCursorLabel = false,
    formatXLabel,
    formatYLabel,
    onPointHover,
    onMarkerHover,
    referenceLines,
    markers,
    inset,
    onActiveIndexChange,
    chartAccessibilityLabel,
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
  } = props;

  const showTooltipEff = showTooltipProp && enableScrubbing;
  const showCursorEff = showCursor && enableScrubbing;
  const showCursorLabelEff = showCursorLabel && enableScrubbing;
  const showXAxisEff = effectiveShowXAxis(props);
  const showYAxisEff = effectiveShowYAxis(props);
  const gridVisibility = resolveGridVisibility(props);

  const [tooltip, setTooltip] = useState<{
    entries: TooltipEntry[];
    left: number;
    top: number;
  } | null>(null);

  const hasNoAxes = !showXAxisEff && !showYAxisEff;
  const margin = useMemo(
    () =>
      resolveChartInset(
        inset,
        hasNoAxes
          ? { top: 16, right: 24, bottom: 16, left: 16 }
          : { top: 16, right: 16, bottom: 36, left: 52 },
      ),
    [inset, hasNoAxes],
  );

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const xDomainMs = useMemo(() => computeXTimeDomainMs(props), [props]);
  const xDomainDates = useMemo(
    (): [Date, Date] => [new Date(xDomainMs[0]), new Date(xDomainMs[1])],
    [xDomainMs],
  );
  const xScale = useMemo(
    () => scaleTime().domain(xDomainDates).range([0, innerWidth]),
    [xDomainDates, innerWidth],
  );

  const yDomain = useMemo(() => computeYDomain(props), [props]);
  const yScale = useMemo(
    () => scaleLinear().domain(yDomain).range([innerHeight, 0]),
    [yDomain, innerHeight],
  );

  const valueLabelEntries = useMemo(() => resolveValueLabels(props), [props]);

  const linePaths = useMemo(() => {
    return lines.map((lineConfig) => {
      const curve = getD3Curve(lineConfig.curve);
      const runs = lineDataRuns(lineConfig.data, lineConfig.connectNulls);
      const lineGenerator = line<DataPoint & { value: number }>()
        .x((d) => xScale(new Date(d.timestamp)))
        .y((d) => yScale(d.value))
        .curve(curve);
      const areaGenerator = area<DataPoint & { value: number }>()
        .x((d) => xScale(new Date(d.timestamp)))
        .y0(innerHeight)
        .y1((d) => yScale(d.value))
        .curve(curve);

      const segments = runs.map((run) => ({
        pathD: lineGenerator(run) ?? '',
        areaD: areaGenerator(run) ?? '',
      }));

      return {
        id: lineConfig.id,
        segments,
        showGradient: Boolean(lineConfig.showGradient),
        color: lineConfig.color,
        strokeWidth: lineConfig.width ?? 2,
      };
    });
  }, [innerHeight, lines, xScale, yScale]);

  const xTicks = useMemo(() => {
    const ticksMs = ensureDomainBoundaryTicks(
      xAxisConfig?.ticks ??
        buildEvenlySpacedTicks(xDomainMs, xAxisConfig?.tickCount ?? 6),
      xDomainMs,
    );
    return ticksMs.map((tick) => new Date(tick));
  }, [xAxisConfig?.tickCount, xAxisConfig?.ticks, xDomainMs]);

  const yTicks = useMemo(
    () =>
      ensureDomainBoundaryTicks(
        yAxisConfig?.ticks ??
          buildEvenlySpacedTicks(yDomain, yAxisConfig?.tickCount ?? 5),
        yDomain,
      ),
    [yAxisConfig?.tickCount, yAxisConfig?.ticks, yDomain],
  );

  const updateFromPress = useCallback(
    (xPx: number, yPx: number): void => {
      const clampedXPx = clamp(xPx, 0, innerWidth);
      const clampedYPx = clamp(yPx, 0, innerHeight);
      const xDate = xScale.invert(clampedXPx);
      const xMs = xDate.getTime();

      const entries: TooltipEntry[] = [];
      for (const lineConfig of lines) {
        const closest = nearestDefinedPointByTime(lineConfig.data, xMs);
        if (!closest) continue;
        entries.push({
          lineId: lineConfig.id,
          lineLabel: getSeriesLabel(lineConfig),
          point: closest,
          color: lineConfig.color,
        });
      }

      if (entries.length === 0) {
        setTooltip(null);
        onPointHover?.(null, '');
        onMarkerHover?.(null);
        onActiveIndexChange?.(null);
        return;
      }

      const primary = entries[0].point;
      const value = primary.value;
      setTooltip({
        entries,
        left: xScale(new Date(primary.timestamp)) + margin.left,
        top:
          value != null
            ? yScale(value) + margin.top
            : margin.top + innerHeight / 2,
      });
      onPointHover?.(primary, entries[0].lineId);

      if (lines[0] && onActiveIndexChange) {
        const idx = lines[0].data.findIndex(
          (p) => p.timestamp === primary.timestamp,
        );
        onActiveIndexChange(idx >= 0 ? idx : null);
      }

      let hitMarker: MarkerConfig | null = null;
      if (markers) {
        const hitRadius = 14;
        for (const marker of markers) {
          const markerX = xScale(new Date(marker.timestamp));
          const markerY = yScale(marker.value);
          const dist = Math.sqrt(
            (clampedXPx - markerX) ** 2 + (clampedYPx - markerY) ** 2,
          );
          if (dist <= hitRadius) {
            hitMarker = marker;
            break;
          }
        }
      }
      onMarkerHover?.(hitMarker);
    },
    [
      innerHeight,
      innerWidth,
      lines,
      margin.left,
      margin.top,
      markers,
      onActiveIndexChange,
      onMarkerHover,
      onPointHover,
      xScale,
      yScale,
    ],
  );

  const handlePress = useCallback(
    (event: SvgPressEvent): void => {
      if (!enableScrubbing) return;
      updateFromPress(event.nativeEvent.locationX, event.nativeEvent.locationY);
    },
    [enableScrubbing, updateFromPress],
  );

  if (width < 10 || height < 10) return null;

  return (
    <View
      accessible={Boolean(chartAccessibilityLabel)}
      accessibilityLabel={chartAccessibilityLabel}
      style={[styles.container, { width, height }]}
    >
      <Svg width={width} height={height}>
        <G x={margin.left} y={margin.top}>
          <Defs>
            {lines
              .filter((lineConfig) => lineConfig.showGradient)
              .map((lineConfig) => (
                <LinearGradient
                  key={`grad-${lineConfig.id}`}
                  id={`grad-${lineConfig.id}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <Stop
                    offset='0%'
                    stopColor={lineConfig.color}
                    stopOpacity={0.3}
                  />
                  <Stop
                    offset='100%'
                    stopColor={lineConfig.color}
                    stopOpacity={0}
                  />
                </LinearGradient>
              ))}
          </Defs>

          {(gridVisibility.x || gridVisibility.y) && (
            <>
              {gridVisibility.y &&
                yTicks.map((tick) => (
                  <Line
                    key={`grid-y-${tick}`}
                    x1={0}
                    y1={yScale(tick)}
                    x2={innerWidth}
                    y2={yScale(tick)}
                    stroke={GRID_LINE_STROKE}
                    strokeDasharray={GRID_LINE_STROKE_DASHARRAY}
                  />
                ))}
              {gridVisibility.x &&
                xTicks.map((tick) => (
                  <Line
                    key={`grid-x-${tick.getTime()}`}
                    x1={xScale(tick)}
                    y1={0}
                    x2={xScale(tick)}
                    y2={innerHeight}
                    stroke={GRID_LINE_STROKE}
                    strokeDasharray={GRID_LINE_STROKE_DASHARRAY}
                  />
                ))}
            </>
          )}

          {referenceLines?.map((referenceLine, i) =>
            (referenceLine.axis ?? 'y') === 'x' ? (
              <G key={`ref-x-${i}`}>
                <Line
                  x1={xScale(new Date(referenceLine.value))}
                  y1={0}
                  x2={xScale(new Date(referenceLine.value))}
                  y2={innerHeight}
                  stroke={referenceLine.color ?? REFERENCE_LINE_STROKE}
                  strokeWidth={getReferenceLineStrokeWidth(referenceLine.style)}
                  strokeDasharray={getRefLineStrokeDasharray(
                    referenceLine.style,
                  )}
                />
              </G>
            ) : (
              <G key={`ref-y-${i}`}>
                <Line
                  x1={0}
                  y1={yScale(referenceLine.value)}
                  x2={innerWidth}
                  y2={yScale(referenceLine.value)}
                  stroke={referenceLine.color ?? REFERENCE_LINE_STROKE}
                  strokeWidth={getReferenceLineStrokeWidth(referenceLine.style)}
                  strokeDasharray={getRefLineStrokeDasharray(
                    referenceLine.style,
                  )}
                />
              </G>
            ),
          )}

          {valueLabelEntries.map((valueLabel) => {
            const cx = xScale(new Date(valueLabel.timestamp));
            const cy = yScale(valueLabel.value);
            const dy = valueLabel.placement === 'above' ? -10 : 16;
            return (
              <SvgText
                key={`vl-${valueLabel.timestamp}-${valueLabel.value}`}
                x={cx}
                y={cy + dy}
                fill={DEFAULT_TEXT_COLOR}
                fontSize={11}
                fontWeight={600}
                textAnchor='middle'
              >
                {valueLabel.label}
              </SvgText>
            );
          })}

          {linePaths.map((linePath) => (
            <G key={linePath.id}>
              {linePath.segments.map((segment, index) => (
                <G key={`${linePath.id}-segment-${index}`}>
                  {linePath.showGradient && (
                    <Path
                      d={segment.areaD}
                      fill={`url(#grad-${linePath.id})`}
                      stroke='none'
                    />
                  )}
                  <Path
                    d={segment.pathD}
                    fill='none'
                    stroke={linePath.color}
                    strokeWidth={linePath.strokeWidth}
                  />
                </G>
              ))}
            </G>
          ))}

          {showCursorEff && tooltip && (
            <Line
              x1={tooltip.left - margin.left}
              y1={0}
              x2={tooltip.left - margin.left}
              y2={innerHeight}
              stroke={DEFAULT_AXIS_COLOR}
              strokeWidth={1}
              strokeDasharray='4 4'
            />
          )}

          {tooltip?.entries.map((entry) => {
            const value = entry.point.value;
            if (value == null) return null;
            const cx = xScale(new Date(entry.point.timestamp));
            const cy = yScale(value);
            const label = `${entry.lineLabel}: ${
              formatYLabel ? formatYLabel(value) : value
            }`;

            return (
              <G key={entry.lineId}>
                <Circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={entry.color}
                  stroke='#020617'
                />
                {showCursorLabelEff && (
                  <SvgText
                    x={cx + 10}
                    y={cy + 4}
                    fill={DEFAULT_TEXT_COLOR}
                    fontSize={11}
                    fontWeight={600}
                    textAnchor='start'
                  >
                    {label}
                  </SvgText>
                )}
              </G>
            );
          })}

          {showXAxisEff && (
            <G y={innerHeight}>
              <Line
                x1={0}
                y1={0}
                x2={innerWidth}
                y2={0}
                stroke={DEFAULT_AXIS_COLOR}
              />
              {xTicks.map((tick) => (
                <SvgText
                  key={tick.getTime()}
                  x={xScale(tick)}
                  y={18}
                  fill={DEFAULT_AXIS_COLOR}
                  fontSize={10}
                  textAnchor='middle'
                >
                  {formatXLabel
                    ? formatXLabel(tick.getTime())
                    : tick.toLocaleDateString()}
                </SvgText>
              ))}
            </G>
          )}

          {showYAxisEff && (
            <G>
              {yTicks.map((tick) => (
                <SvgText
                  key={tick}
                  x={-6}
                  y={yScale(tick)}
                  fill={DEFAULT_AXIS_COLOR}
                  fontSize={10}
                  textAnchor='end'
                  alignmentBaseline='middle'
                >
                  {formatYLabel ? formatYLabel(tick) : String(Math.round(tick))}
                </SvgText>
              ))}
            </G>
          )}

          {markers?.map((marker, index) => {
            const isOutlined = marker.variant === 'outlined';
            const markerColor = marker.color ?? '#e87a2c';
            return (
              <Circle
                key={`marker-${index}`}
                cx={xScale(new Date(marker.timestamp))}
                cy={yScale(marker.value)}
                r={marker.radius ?? 4}
                fill={isOutlined ? 'transparent' : markerColor}
                stroke={isOutlined ? markerColor : 'none'}
                strokeWidth={isOutlined ? 2 : 0}
              />
            );
          })}

          <Rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill='transparent'
            onPress={handlePress}
          />
        </G>
      </Svg>

      {showTooltipEff && tooltip && (
        <View
          pointerEvents='none'
          style={[
            styles.tooltip,
            {
              left: tooltip.left,
              top: tooltip.top,
            },
          ]}
        >
          {tooltip.entries.map((entry) => (
            <Text key={entry.lineId} style={styles.tooltipValue}>
              <Text style={[styles.tooltipSeries, { color: entry.color }]}>
                {entry.lineLabel}
              </Text>
              {': '}
              {entry.point.value == null
                ? '—'
                : formatYLabel
                  ? formatYLabel(entry.point.value)
                  : entry.point.value}
            </Text>
          ))}
          <Text style={styles.tooltipDate}>
            {formatXLabel
              ? formatXLabel(tooltip.entries[0].point.timestamp)
              : new Date(
                  tooltip.entries[0].point.timestamp,
                ).toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    transform: [{ translateX: -50 }, { translateY: -56 }],
    backgroundColor: DEFAULT_TOOLTIP_BACKGROUND,
    borderColor: DEFAULT_TOOLTIP_BORDER,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tooltipValue: {
    color: DEFAULT_TEXT_COLOR,
    fontSize: 12,
  },
  tooltipSeries: {
    fontWeight: '600',
  },
  tooltipDate: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
});
