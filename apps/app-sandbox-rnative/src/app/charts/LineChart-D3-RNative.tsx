import { scaleLinear } from 'd3-scale';
import { area, line } from 'd3-shape';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
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

type SnapPoint = {
  timestamp: number;
  value: number;
  sourceIndex: number;
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const DEFAULT_AXIS_COLOR = '#94a3b8';
const DEFAULT_TEXT_COLOR = '#e2e8f0';
const DEFAULT_TOOLTIP_BACKGROUND = '#0f172a';
const DEFAULT_TOOLTIP_BORDER = '#334155';

export const LineChartD3RNative = (props: LineChartProps) => {
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
    onScrubbingChange,
    chartAccessibilityLabel,
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
    series,
    lines: linesConfig,
  } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps -- granular deps for perf
  const lines = useMemo(() => resolveSeries(props), [series, linesConfig]);

  const showTooltipEff = showTooltipProp && enableScrubbing;
  const showCursorEff = showCursor && enableScrubbing;
  const showCursorLabelEff = showCursorLabel && enableScrubbing;
  const showXAxisEff = effectiveShowXAxis(props);
  const showYAxisEff = effectiveShowYAxis(props);
  const gridVisibility = resolveGridVisibility(props);
  const activeSnapIndexRef = useRef<number | null>(null);
  const isScrubbingRef = useRef<boolean>(false);

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

  const xDomainMs = useMemo(
    () => computeXTimeDomainMs(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- granular deps for perf
    [lines, xAxisConfig?.domain],
  );

  const xScale = useMemo(
    () => scaleLinear().domain(xDomainMs).range([0, innerWidth]),
    [xDomainMs, innerWidth],
  );

  const yDomain = useMemo(
    () => computeYDomain(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- granular deps for perf
    [lines, yAxisConfig?.domain, referenceLines, props.valueLabels],
  );
  const yScale = useMemo(
    () => scaleLinear().domain(yDomain).range([innerHeight, 0]),
    [yDomain, innerHeight],
  );

  const valueLabelEntries = useMemo(
    () => resolveValueLabels(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- granular deps for perf
    [lines, props.valueLabels, formatYLabel],
  );
  const primarySnapPoints = useMemo((): SnapPoint[] => {
    const primary = lines[0];
    if (!primary) return [];

    const result: SnapPoint[] = [];
    for (let i = 0; i < primary.data.length; i++) {
      const point = primary.data[i];
      if (point.value != null) {
        result.push({
          timestamp: point.timestamp,
          value: point.value,
          sourceIndex: i,
        });
      }
    }
    return result;
  }, [lines]);

  const linePaths = useMemo(() => {
    return lines.map((lineConfig) => {
      const curve = getD3Curve(lineConfig.curve);
      const runs = lineDataRuns(lineConfig.data, lineConfig.connectNulls);
      const lineGenerator = line<DataPoint & { value: number }>()
        .x((d) => xScale(d.timestamp))
        .y((d) => yScale(d.value))
        .curve(curve);
      const areaGenerator = area<DataPoint & { value: number }>()
        .x((d) => xScale(d.timestamp))
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
    return ensureDomainBoundaryTicks(
      xAxisConfig?.ticks ??
        buildEvenlySpacedTicks(xDomainMs, xAxisConfig?.tickCount ?? 6),
      xDomainMs,
    );
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

  const clearScrubbing = useCallback((): void => {
    activeSnapIndexRef.current = null;
    setTooltip(null);
    onPointHover?.(null, '');
    onMarkerHover?.(null);
    onActiveIndexChange?.(null);
  }, [onActiveIndexChange, onMarkerHover, onPointHover]);

  const setScrubbingState = useCallback(
    (isScrubbing: boolean): void => {
      if (isScrubbingRef.current === isScrubbing) return;
      isScrubbingRef.current = isScrubbing;
      onScrubbingChange?.(isScrubbing);
    },
    [onScrubbingChange],
  );

  const findNearestSnapIndex = useCallback(
    (xPx: number): number | null => {
      if (primarySnapPoints.length === 0) return null;
      const clampedXPx = clamp(xPx, 0, innerWidth);
      const targetMs = xScale.invert(clampedXPx);

      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let i = 0; i < primarySnapPoints.length; i++) {
        const distance = Math.abs(primarySnapPoints[i].timestamp - targetMs);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      }

      return bestIndex;
    },
    [innerWidth, primarySnapPoints, xScale],
  );

  const updateFromSnapIndex = useCallback(
    (snapIndex: number): void => {
      const snapPoint = primarySnapPoints[snapIndex];
      if (!snapPoint) {
        clearScrubbing();
        return;
      }

      const xMs = snapPoint.timestamp;
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
        clearScrubbing();
        return;
      }

      const primaryLineId = lines[0]?.id ?? entries[0].lineId;
      setTooltip({
        entries,
        left: xScale(snapPoint.timestamp) + margin.left,
        top: yScale(snapPoint.value) + margin.top,
      });
      onPointHover?.(
        { timestamp: snapPoint.timestamp, value: snapPoint.value },
        primaryLineId,
      );
      onActiveIndexChange?.(snapPoint.sourceIndex);

      let hitMarker: MarkerConfig | null = null;
      if (markers) {
        const snapX = xScale(snapPoint.timestamp);
        const snapY = yScale(snapPoint.value);
        const hitRadius = 14;
        for (const marker of markers) {
          const markerX = xScale(marker.timestamp);
          const markerY = yScale(marker.value);
          const dist = Math.sqrt(
            (snapX - markerX) ** 2 + (snapY - markerY) ** 2,
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
      clearScrubbing,
      lines,
      margin.left,
      margin.top,
      markers,
      onActiveIndexChange,
      onMarkerHover,
      onPointHover,
      primarySnapPoints,
      xScale,
      yScale,
    ],
  );

  const handleScrubStart = useCallback(
    (event: GestureResponderEvent): void => {
      if (!enableScrubbing) return;
      event.stopPropagation();
      setScrubbingState(true);
      const chartXPx = event.nativeEvent.locationX - margin.left;
      const nextIndex = findNearestSnapIndex(chartXPx);
      if (nextIndex == null) {
        clearScrubbing();
        return;
      }
      activeSnapIndexRef.current = nextIndex;
      updateFromSnapIndex(nextIndex);
    },
    [
      clearScrubbing,
      enableScrubbing,
      findNearestSnapIndex,
      margin.left,
      setScrubbingState,
      updateFromSnapIndex,
    ],
  );

  const handleScrubMove = useCallback(
    (event: GestureResponderEvent): void => {
      if (!enableScrubbing || activeSnapIndexRef.current == null) return;
      event.stopPropagation();
      const chartXPx = event.nativeEvent.locationX - margin.left;
      const nextIndex = findNearestSnapIndex(chartXPx);
      if (nextIndex == null || nextIndex === activeSnapIndexRef.current) return;
      activeSnapIndexRef.current = nextIndex;
      updateFromSnapIndex(nextIndex);
    },
    [enableScrubbing, findNearestSnapIndex, margin.left, updateFromSnapIndex],
  );

  const handleScrubEnd = useCallback((): void => {
    if (!enableScrubbing) return;
    setScrubbingState(false);
    clearScrubbing();
  }, [clearScrubbing, enableScrubbing, setScrubbingState]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => enableScrubbing,
        onStartShouldSetPanResponderCapture: () => enableScrubbing,
        onMoveShouldSetPanResponder: () => enableScrubbing,
        onMoveShouldSetPanResponderCapture: () => enableScrubbing,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: (event) => {
          handleScrubStart(event);
        },
        onPanResponderMove: (event) => {
          handleScrubMove(event);
        },
        onPanResponderRelease: () => {
          handleScrubEnd();
        },
        onPanResponderTerminate: () => {
          handleScrubEnd();
        },
      }),
    [enableScrubbing, handleScrubEnd, handleScrubMove, handleScrubStart],
  );

  useEffect(() => {
    if (!enableScrubbing) {
      setScrubbingState(false);
      clearScrubbing();
    }
  }, [clearScrubbing, enableScrubbing, setScrubbingState]);

  useEffect(() => {
    return () => {
      setScrubbingState(false);
    };
  }, [setScrubbingState]);

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
                    key={`grid-x-${tick}`}
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
                  x1={xScale(referenceLine.value)}
                  y1={0}
                  x2={xScale(referenceLine.value)}
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
            const cx = xScale(valueLabel.timestamp);
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
            const cx = xScale(entry.point.timestamp);
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
                  key={tick}
                  x={xScale(tick)}
                  y={18}
                  fill={DEFAULT_AXIS_COLOR}
                  fontSize={10}
                  textAnchor='middle'
                >
                  {formatXLabel
                    ? formatXLabel(tick)
                    : new Date(tick).toLocaleDateString()}
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
                cx={xScale(marker.timestamp)}
                cy={yScale(marker.value)}
                r={marker.radius ?? 4}
                fill={isOutlined ? 'transparent' : markerColor}
                stroke={isOutlined ? markerColor : 'none'}
                strokeWidth={isOutlined ? 2 : 0}
              />
            );
          })}
        </G>
      </Svg>

      {enableScrubbing && innerWidth > 0 && innerHeight > 0 && (
        <View
          style={[
            styles.interactionLayer,
            {
              left: 0,
              top: 0,
              width,
              height,
            },
          ]}
          onTouchStart={(event) => {
            event.stopPropagation();
          }}
          onTouchMove={(event) => {
            event.stopPropagation();
          }}
          onTouchEnd={(event) => {
            event.stopPropagation();
          }}
          {...panResponder.panHandlers}
        />
      )}

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
  interactionLayer: {
    position: 'absolute',
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
