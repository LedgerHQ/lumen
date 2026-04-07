import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  PanResponder,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import {
  Area as VictoryArea,
  CartesianChart,
  Line as VictoryLine,
} from 'victory-native';
import type { DataPoint, LineChartProps } from './types';
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

const DEFAULT_AXIS_COLOR = '#94a3b8';
const DEFAULT_TEXT_COLOR = '#e2e8f0';
const DEFAULT_TOOLTIP_BACKGROUND = '#0f172a';
const DEFAULT_TOOLTIP_BORDER = '#334155';

type SnapPoint = {
  timestamp: number;
};

const projectX = (
  value: number,
  domain: [number, number],
  chartLeft: number,
  chartWidth: number,
): number => {
  const [min, max] = domain;
  const safeRange = max - min || 1;
  const normalized = (value - min) / safeRange;
  return chartLeft + normalized * chartWidth;
};

const projectY = (
  value: number,
  domain: [number, number],
  chartTop: number,
  chartHeight: number,
): number => {
  const [min, max] = domain;
  const safeRange = max - min || 1;
  const normalized = (value - min) / safeRange;
  return chartTop + (1 - normalized) * chartHeight;
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const LineChartVictoryNativeXL = (props: LineChartProps) => {
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
    onActiveIndexChange,
    onScrubbingChange,
    chartAccessibilityLabel,
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
    referenceLines,
    markers,
  } = props;

  const showTooltipEff = showTooltipProp && enableScrubbing;
  const showCursorEff = showCursor && enableScrubbing;
  const showCursorLabelEff = showCursorLabel && enableScrubbing;
  const showXAxisEff = effectiveShowXAxis(props);
  const showYAxisEff = effectiveShowYAxis(props);
  const gridVisibility = resolveGridVisibility(props);

  const hasNoAxes = !showXAxisEff && !showYAxisEff;
  const margin = useMemo(
    () =>
      resolveChartInset(
        props.inset,
        hasNoAxes
          ? { top: 16, right: 24, bottom: 16, left: 16 }
          : { top: 16, right: 16, bottom: 36, left: 52 },
      ),
    [props.inset, hasNoAxes],
  );

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const xDomainMs = useMemo(() => computeXTimeDomainMs(props), [props]);
  const yDomain = useMemo(() => computeYDomain(props), [props]);

  const xTicks = useMemo(() => {
    const ticksMs = ensureDomainBoundaryTicks(
      xAxisConfig?.ticks ??
        buildEvenlySpacedTicks(xDomainMs, xAxisConfig?.tickCount ?? 6),
      xDomainMs,
    );
    return ticksMs;
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

  const valueLabelEntries = useMemo(() => resolveValueLabels(props), [props]);
  const scrubbingRef = useRef<boolean>(false);
  const activeSnapTimestampRef = useRef<number | null>(null);
  const lastActiveIndexRef = useRef<number | null>(null);
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);
  const [activeEntries, setActiveEntries] = useState<TooltipEntry[]>([]);

  const chartData = useMemo((): Array<Record<string, number | null>> => {
    const timestampSet = new Set<number>();
    const valueMapByLine = new Map<string, Map<number, number | null>>();
    for (const line of lines) {
      const valueMap = new Map<number, number | null>();
      for (const point of line.data) {
        timestampSet.add(point.timestamp);
        valueMap.set(point.timestamp, point.value);
      }
      valueMapByLine.set(line.id, valueMap);
    }

    const timestamps = Array.from(timestampSet).sort((a, b) => a - b);
    return timestamps.map((timestamp) => {
      const row: Record<string, number | null> = { x: timestamp };
      for (const line of lines) {
        row[line.id] = valueMapByLine.get(line.id)?.get(timestamp) ?? null;
      }
      return row;
    });
  }, [lines]);

  const yKeys = useMemo(() => lines.map((line) => line.id), [lines]);
  const primarySnapPoints = useMemo((): SnapPoint[] => {
    const primary = lines[0];
    if (!primary) return [];

    return primary.data
      .filter((point) => point.value != null)
      .map((point) => ({
        timestamp: point.timestamp,
      }));
  }, [lines]);

  const clearInteraction = useCallback((): void => {
    activeSnapTimestampRef.current = null;
    setActiveTimestamp(null);
    setActiveEntries([]);
    onPointHover?.(null, '');
    onMarkerHover?.(null);
    if (lastActiveIndexRef.current != null) {
      lastActiveIndexRef.current = null;
      onActiveIndexChange?.(null);
    }
  }, [onActiveIndexChange, onMarkerHover, onPointHover]);

  const updateFromTimestamp = useCallback(
    (xTimestamp: number): void => {
      const primary = lines[0];
      if (!primary) return;
      const nearestPrimary = nearestDefinedPointByTime(primary.data, xTimestamp);
      if (!nearestPrimary || nearestPrimary.value == null) {
        clearInteraction();
        return;
      }

      const entries: TooltipEntry[] = [];
      for (const line of lines) {
        const nearest = nearestDefinedPointByTime(line.data, nearestPrimary.timestamp);
        if (!nearest || nearest.value == null) continue;
        entries.push({
          lineId: line.id,
          lineLabel: getSeriesLabel(line),
          point: nearest,
          color: line.color,
        });
      }

      if (entries.length === 0) {
        clearInteraction();
        return;
      }

      activeSnapTimestampRef.current = nearestPrimary.timestamp;
      setActiveTimestamp(nearestPrimary.timestamp);
      setActiveEntries(entries);
      onPointHover?.(nearestPrimary, primary.id);

      const nextIndex = primary.data.findIndex(
        (point) => point.timestamp === nearestPrimary.timestamp,
      );
      const normalizedIndex = nextIndex >= 0 ? nextIndex : null;
      if (normalizedIndex !== lastActiveIndexRef.current) {
        lastActiveIndexRef.current = normalizedIndex;
        onActiveIndexChange?.(normalizedIndex);
      }

      if (markers && markers.length > 0) {
        const xRange = xDomainMs[1] - xDomainMs[0] || 1;
        const threshold = xRange * 0.015;
        const marker =
          markers.find(
            (candidate) =>
              Math.abs(candidate.timestamp - nearestPrimary.timestamp) <= threshold,
          ) ?? null;
        onMarkerHover?.(marker);
      } else {
        onMarkerHover?.(null);
      }
    },
    [
      clearInteraction,
      lines,
      markers,
      onActiveIndexChange,
      onMarkerHover,
      onPointHover,
      xDomainMs,
    ],
  );

  const setScrubbingState = useCallback(
    (isScrubbing: boolean): void => {
      if (scrubbingRef.current === isScrubbing) return;
      scrubbingRef.current = isScrubbing;
      onScrubbingChange?.(isScrubbing);
    },
    [onScrubbingChange],
  );

  const findNearestSnapTimestamp = useCallback(
    (xPx: number): number | null => {
      if (primarySnapPoints.length === 0 || innerWidth <= 0) return null;

      const clampedXPx = clamp(xPx, 0, innerWidth);
      const ratio = clampedXPx / innerWidth;
      const targetTimestamp = xDomainMs[0] + ratio * (xDomainMs[1] - xDomainMs[0]);

      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let i = 0; i < primarySnapPoints.length; i++) {
        const distance = Math.abs(primarySnapPoints[i].timestamp - targetTimestamp);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      }

      return primarySnapPoints[bestIndex]?.timestamp ?? null;
    },
    [innerWidth, primarySnapPoints, xDomainMs],
  );

  const handleScrubStart = useCallback(
    (event: GestureResponderEvent): void => {
      if (!enableScrubbing) return;
      event.stopPropagation();
      setScrubbingState(true);
      const chartXPx = event.nativeEvent.locationX - margin.left;
      const timestamp = findNearestSnapTimestamp(chartXPx);
      if (timestamp == null) {
        clearInteraction();
        return;
      }
      updateFromTimestamp(timestamp);
    },
    [
      clearInteraction,
      enableScrubbing,
      findNearestSnapTimestamp,
      margin.left,
      setScrubbingState,
      updateFromTimestamp,
    ],
  );

  const handleScrubMove = useCallback(
    (event: GestureResponderEvent): void => {
      if (!enableScrubbing || !scrubbingRef.current) return;
      event.stopPropagation();
      const chartXPx = event.nativeEvent.locationX - margin.left;
      const timestamp = findNearestSnapTimestamp(chartXPx);
      if (timestamp == null || timestamp === activeSnapTimestampRef.current) return;
      updateFromTimestamp(timestamp);
    },
    [enableScrubbing, findNearestSnapTimestamp, margin.left, updateFromTimestamp],
  );

  const handleScrubEnd = useCallback((): void => {
    if (!enableScrubbing) return;
    setScrubbingState(false);
    clearInteraction();
  }, [clearInteraction, enableScrubbing, setScrubbingState]);

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
    if (enableScrubbing) return;
    setScrubbingState(false);
    clearInteraction();
  }, [clearInteraction, enableScrubbing, setScrubbingState]);

  useEffect(() => {
    return () => {
      setScrubbingState(false);
    };
  }, [setScrubbingState]);

  if (width < 10 || height < 10 || lines.length === 0) return null;

  const tooltipPoint = activeEntries[0];
  const tooltipLeft =
    tooltipPoint == null
      ? 0
      : projectX(tooltipPoint.point.timestamp, xDomainMs, margin.left, innerWidth);
  const tooltipTop =
    tooltipPoint == null
      ? 0
      : projectY(tooltipPoint.point.value ?? 0, yDomain, margin.top, innerHeight);

  return (
    <View
      accessible={Boolean(chartAccessibilityLabel)}
      accessibilityLabel={chartAccessibilityLabel}
      style={[styles.container, { width, height }]}
    >
      <View style={StyleSheet.absoluteFill}>
        <CartesianChart
          data={chartData}
          xKey={'x' as never}
          yKeys={yKeys}
          domain={{ x: xDomainMs, y: yDomain }}
          padding={margin}
        >
          {({ points, chartBounds }) =>
            lines.map((lineConfig) => {
              const linePoints = points[lineConfig.id];
              if (!linePoints) return null;
              return (
                <Fragment key={lineConfig.id}>
                  {lineConfig.showGradient && (
                    <VictoryArea
                      points={linePoints}
                      y0={chartBounds.bottom}
                      color={lineConfig.color}
                      opacity={0.18}
                      curveType={lineConfig.curve ?? 'natural'}
                      connectMissingData={lineConfig.connectNulls ?? false}
                    />
                  )}
                  <VictoryLine
                    points={linePoints}
                    color={lineConfig.color}
                    strokeWidth={lineConfig.width ?? 2}
                    curveType={lineConfig.curve ?? 'natural'}
                    connectMissingData={lineConfig.connectNulls ?? false}
                  />
                </Fragment>
              );
            })
          }
        </CartesianChart>
      </View>

      <Svg width={width} height={height} pointerEvents='none'>
        {(gridVisibility.x || gridVisibility.y) && (
          <>
            {gridVisibility.y &&
              yTicks.map((tick) => (
                <Line
                  key={`grid-y-${tick}`}
                  x1={margin.left}
                  y1={projectY(tick, yDomain, margin.top, innerHeight)}
                  x2={width - margin.right}
                  y2={projectY(tick, yDomain, margin.top, innerHeight)}
                  stroke={GRID_LINE_STROKE}
                  strokeDasharray={GRID_LINE_STROKE_DASHARRAY}
                />
              ))}
            {gridVisibility.x &&
              xTicks.map((tick) => (
                <Line
                  key={`grid-x-${tick}`}
                  x1={projectX(tick, xDomainMs, margin.left, innerWidth)}
                  y1={margin.top}
                  x2={projectX(tick, xDomainMs, margin.left, innerWidth)}
                  y2={height - margin.bottom}
                  stroke={GRID_LINE_STROKE}
                  strokeDasharray={GRID_LINE_STROKE_DASHARRAY}
                />
              ))}
          </>
        )}

        {referenceLines?.map((referenceLine, i) =>
          (referenceLine.axis ?? 'y') === 'x' ? (
            <Line
              key={`ref-x-${i}`}
              x1={projectX(referenceLine.value, xDomainMs, margin.left, innerWidth)}
              y1={margin.top}
              x2={projectX(referenceLine.value, xDomainMs, margin.left, innerWidth)}
              y2={height - margin.bottom}
              stroke={referenceLine.color ?? REFERENCE_LINE_STROKE}
              strokeWidth={getReferenceLineStrokeWidth(referenceLine.style)}
              strokeDasharray={getRefLineStrokeDasharray(referenceLine.style)}
            />
          ) : (
            <Line
              key={`ref-y-${i}`}
              x1={margin.left}
              y1={projectY(referenceLine.value, yDomain, margin.top, innerHeight)}
              x2={width - margin.right}
              y2={projectY(referenceLine.value, yDomain, margin.top, innerHeight)}
              stroke={referenceLine.color ?? REFERENCE_LINE_STROKE}
              strokeWidth={getReferenceLineStrokeWidth(referenceLine.style)}
              strokeDasharray={getRefLineStrokeDasharray(referenceLine.style)}
            />
          ),
        )}

        {valueLabelEntries.map((valueLabel) => {
          const cx = projectX(
            valueLabel.timestamp,
            xDomainMs,
            margin.left,
            innerWidth,
          );
          const cy = projectY(valueLabel.value, yDomain, margin.top, innerHeight);
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

        {markers?.map((marker, index) => {
          const isOutlined = marker.variant === 'outlined';
          const markerColor = marker.color ?? '#E87A2C';
          return (
            <Circle
              key={`marker-${index}`}
              cx={projectX(marker.timestamp, xDomainMs, margin.left, innerWidth)}
              cy={projectY(marker.value, yDomain, margin.top, innerHeight)}
              r={marker.radius ?? 4}
              fill={isOutlined ? 'transparent' : markerColor}
              stroke={isOutlined ? markerColor : 'none'}
              strokeWidth={isOutlined ? 2 : 0}
            />
          );
        })}

        {showCursorEff && activeTimestamp != null && (
          <Line
            x1={projectX(activeTimestamp, xDomainMs, margin.left, innerWidth)}
            y1={margin.top}
            x2={projectX(activeTimestamp, xDomainMs, margin.left, innerWidth)}
            y2={height - margin.bottom}
            stroke={DEFAULT_AXIS_COLOR}
            strokeWidth={1}
            strokeDasharray='4 4'
          />
        )}

        {activeEntries.map((entry) => {
          if (entry.point.value == null) return null;
          return (
            <Circle
              key={`active-point-${entry.lineId}`}
              cx={projectX(entry.point.timestamp, xDomainMs, margin.left, innerWidth)}
              cy={projectY(entry.point.value, yDomain, margin.top, innerHeight)}
              r={4}
              fill={entry.color}
              stroke='#020617'
            />
          );
        })}

        {showCursorLabelEff &&
          activeEntries[0] &&
          activeEntries[0].point.value != null && (
            <SvgText
              x={
                projectX(
                  activeEntries[0].point.timestamp,
                  xDomainMs,
                  margin.left,
                  innerWidth,
                ) + 10
              }
              y={
                projectY(
                  activeEntries[0].point.value,
                  yDomain,
                  margin.top,
                  innerHeight,
                ) + 4
              }
              fill={DEFAULT_TEXT_COLOR}
              fontSize={11}
              fontWeight={600}
              textAnchor='start'
            >
              {`${activeEntries[0].lineLabel}: ${
                formatYLabel
                  ? formatYLabel(activeEntries[0].point.value)
                  : activeEntries[0].point.value
              }`}
            </SvgText>
          )}

        {showXAxisEff && (
          <>
            <Line
              x1={margin.left}
              y1={height - margin.bottom}
              x2={width - margin.right}
              y2={height - margin.bottom}
              stroke={DEFAULT_AXIS_COLOR}
            />
            {xTicks.map((tick) => (
              <SvgText
                key={`x-tick-${tick}`}
                x={projectX(tick, xDomainMs, margin.left, innerWidth)}
                y={height - margin.bottom + 18}
                fill={DEFAULT_AXIS_COLOR}
                fontSize={10}
                textAnchor='middle'
              >
                {formatXLabel ? formatXLabel(tick) : new Date(tick).toLocaleDateString()}
              </SvgText>
            ))}
          </>
        )}

        {showYAxisEff &&
          yTicks.map((tick) => (
            <SvgText
              key={`y-tick-${tick}`}
              x={margin.left - 6}
              y={projectY(tick, yDomain, margin.top, innerHeight)}
              fill={DEFAULT_AXIS_COLOR}
              fontSize={10}
              textAnchor='end'
              alignmentBaseline='middle'
            >
              {formatYLabel ? formatYLabel(tick) : String(Math.round(tick))}
            </SvgText>
          ))}
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

      {showTooltipEff && activeEntries.length > 0 && (
        <View
          pointerEvents='none'
          style={[
            styles.tooltip,
            {
              left: tooltipLeft,
              top: tooltipTop,
            },
          ]}
        >
          {activeEntries.map((entry) => (
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
              ? formatXLabel(activeEntries[0].point.timestamp)
              : new Date(activeEntries[0].point.timestamp).toLocaleDateString()}
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
    color: DEFAULT_AXIS_COLOR,
    fontSize: 11,
    marginTop: 2,
  },
});
