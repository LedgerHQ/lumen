import {
  Checkbox,
  IconButton,
  SegmentedControl,
  SegmentedControlButton,
  Switch,
} from '@ledgerhq/lumen-ui-react';
import { Moon, Sun } from '@ledgerhq/lumen-ui-react/symbols';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { CHART_HEIGHT, CHART_WIDTH, LIB_LABELS } from './constants';
import type { LibKey } from './constants';
import { LineChartD3 } from './d3';
import { FeatureComparisonTable } from './FeatureComparisonTable';
import {
  formatCurrency,
  formatDate,
  ethDaily,
  walletLines,
  walletReferenceLines,
  walletValueLabels,
  walletMarkers,
} from './mockData';
import { PerfBenchmark } from './PerfBenchmark';
import { LineChartRecharts } from './recharts';
import type { DataPoint, LineChartProps, MarkerConfig } from './types';
import {
  buildEvenlySpacedTicks,
  computeYDomain,
  ensureDomainBoundaryTicks,
  getReferenceLineStyleCaption,
} from './utils';
import { LineChartVictory } from './victory';
import { LineChartVisx } from './visx';

type ChartsPocPageProps = {
  colorScheme: 'light' | 'dark';
  onColorSchemeChange: (scheme: 'light' | 'dark') => void;
};

const parseNumericList = (input: string): number[] =>
  input
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value));

const buildDefaultXAxisIndexInput = (totalPoints: number): string => {
  if (totalPoints <= 0) return '';
  const marks = [0, 0.2, 0.4, 0.6, 0.8, 1].map(
    (ratio) => Math.round(ratio * (totalPoints - 1)) + 1,
  );
  return Array.from(new Set(marks)).join(', ');
};

const resolveTickCountFromInput = (input: string, fallback: number): number => {
  const count = parseNumericList(input).length;
  return Math.max(2, count || fallback);
};

const buildAxisLabelFormatter = (
  ticks: number[] | undefined,
  labels: number[],
  fallback: (value: number) => string,
): ((value: number) => string) => {
  if (!ticks || ticks.length === 0 || labels.length !== ticks.length) {
    return fallback;
  }
  return (value: number): string => {
    let closestIndex = 0;
    let closestDiff = Infinity;
    for (let i = 0; i < ticks.length; i++) {
      const diff = Math.abs(ticks[i] - value);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    }
    const label = labels[closestIndex];
    return Number.isInteger(label) ? String(label) : label.toFixed(2);
  };
};

export const ChartsPocPage = ({
  colorScheme,
  onColorSchemeChange,
}: ChartsPocPageProps) => {
  const [activeLib, setActiveLib] = useState<LibKey>('recharts');

  const [walletGradient, setWalletGradient] = useState(false);
  const [refLinesEnabled, setRefLinesEnabled] = useState<boolean[]>(() =>
    walletReferenceLines.map(() => true),
  );
  const [walletShowValueLabels, setWalletShowValueLabels] = useState(true);
  const [walletShowMarkers, setWalletShowMarkers] = useState(true);
  const [walletEnableScrubbing, setWalletEnableScrubbing] = useState(true);
  const [walletShowXGrid, setWalletShowXGrid] = useState(true);
  const [walletShowYGrid, setWalletShowYGrid] = useState(true);
  const [walletShowHoverCursor, setWalletShowHoverCursor] = useState(true);
  const [walletShowCursorLabel, setWalletShowCursorLabel] = useState(true);
  const [walletUseMultipleSeries, setWalletUseMultipleSeries] = useState(false);
  const [walletUseSeriesLabels, setWalletUseSeriesLabels] = useState(true);
  const [walletUseCustomXAxisData, setWalletUseCustomXAxisData] =
    useState(true);
  const [walletUseCustomYAxisData, setWalletUseCustomYAxisData] =
    useState(true);
  const [walletXAxisDataInput, setWalletXAxisDataInput] = useState('');
  const [walletYAxisDataInput, setWalletYAxisDataInput] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<MarkerConfig | null>(null);

  const handlePointHover = useCallback((point: DataPoint | null) => {
    setHoveredPoint(point);
  }, []);

  const handleMarkerHover = useCallback((marker: MarkerConfig | null) => {
    setHoveredMarker(marker);
  }, []);

  useEffect(() => {
    if (!walletEnableScrubbing || !walletShowHoverCursor) {
      setHoveredPoint(null);
      setHoveredMarker(null);
    }
  }, [walletEnableScrubbing, walletShowHoverCursor]);

  const lines = useMemo(() => {
    const btcData = walletLines[0]?.data ?? [];
    const btcBase = btcData[0]?.value ?? 0;
    const ethBase = ethDaily[0]?.value ?? 1;
    const ethComparableData: DataPoint[] = btcData.map((btcPoint, i) => {
      const ethValue = ethDaily[i]?.value;
      if (ethValue == null) {
        return { timestamp: btcPoint.timestamp, value: null };
      }
      // Keep ETH-like movement while normalizing around BTC range for readability.
      const normalized = (ethValue / ethBase) * btcBase * 0.94;
      return {
        timestamp: btcPoint.timestamp,
        value: Math.round(normalized * 100) / 100,
      };
    });

    const series = walletUseMultipleSeries
      ? [
          ...walletLines,
          {
            id: 'eth',
            label: 'Ethereum',
            data: ethComparableData,
            color: 'var(--color-crypto-ethereum)',
            width: 2,
            showGradient: false,
          },
        ]
      : walletLines;

    return series.map((line) => ({
      ...line,
      showGradient: walletGradient,
      label: walletUseSeriesLabels ? line.label : line.id,
    }));
  }, [walletUseMultipleSeries, walletGradient, walletUseSeriesLabels]);

  const defaultXAxisDataInput = useMemo(
    () => buildDefaultXAxisIndexInput(lines[0]?.data.length ?? 0),
    [lines],
  );

  const defaultYAxisTicks = useMemo(() => {
    const numericValues = lines
      .flatMap((line) => line.data.map((point) => point.value))
      .filter((value): value is number => value != null);
    if (numericValues.length === 0) return [] as number[];
    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    if (min === max) return [min];
    const step = (max - min) / 4;
    return [min, min + step, min + 2 * step, min + 3 * step, max].map(
      (v) => Math.round(v * 100) / 100,
    );
  }, [lines]);

  const defaultYAxisDataInput = useMemo(
    () => defaultYAxisTicks.map((tick) => String(Math.round(tick))).join(', '),
    [defaultYAxisTicks],
  );

  useEffect(() => {
    if (!walletXAxisDataInput) {
      setWalletXAxisDataInput(defaultXAxisDataInput);
    }
  }, [walletXAxisDataInput, defaultXAxisDataInput]);

  useEffect(() => {
    if (!walletYAxisDataInput) {
      setWalletYAxisDataInput(defaultYAxisDataInput);
    }
  }, [walletYAxisDataInput, defaultYAxisDataInput]);

  const visibleReferenceLines = useMemo(
    () => walletReferenceLines.filter((_, i) => refLinesEnabled[i]),
    [refLinesEnabled],
  );

  const customXAxisTicks = useMemo(() => {
    if (!walletUseCustomXAxisData) return undefined;
    const primaryData = lines[0]?.data;
    if (!primaryData || primaryData.length === 0) return undefined;
    const xDomain: [number, number] = [
      primaryData[0].timestamp,
      primaryData[primaryData.length - 1].timestamp,
    ];
    const tickCount = resolveTickCountFromInput(
      walletXAxisDataInput || defaultXAxisDataInput,
      6,
    );
    return ensureDomainBoundaryTicks(
      buildEvenlySpacedTicks(xDomain, tickCount),
      xDomain,
    );
  }, [
    walletUseCustomXAxisData,
    lines,
    walletXAxisDataInput,
    defaultXAxisDataInput,
  ]);

  const customYAxisTicks = useMemo(() => {
    if (!walletUseCustomYAxisData) return undefined;
    const yDomain = computeYDomain({
      lines,
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      referenceLines:
        visibleReferenceLines.length > 0 ? visibleReferenceLines : undefined,
      valueLabels: walletShowValueLabels ? walletValueLabels : undefined,
    });
    const tickCount = resolveTickCountFromInput(
      walletYAxisDataInput || defaultYAxisDataInput,
      5,
    );
    return ensureDomainBoundaryTicks(
      buildEvenlySpacedTicks(yDomain, tickCount),
      yDomain,
    );
  }, [
    walletUseCustomYAxisData,
    walletYAxisDataInput,
    defaultYAxisDataInput,
    lines,
    visibleReferenceLines,
    walletShowValueLabels,
  ]);

  const xAxisLegendValues = useMemo(
    () => parseNumericList(walletXAxisDataInput || defaultXAxisDataInput),
    [walletXAxisDataInput, defaultXAxisDataInput],
  );
  const yAxisLegendValues = useMemo(
    () => parseNumericList(walletYAxisDataInput || defaultYAxisDataInput),
    [walletYAxisDataInput, defaultYAxisDataInput],
  );
  const xAxisTickFormatter = useMemo(
    () =>
      buildAxisLabelFormatter(customXAxisTicks, xAxisLegendValues, formatDate),
    [customXAxisTicks, xAxisLegendValues],
  );
  const yAxisTickFormatter = useMemo(
    () =>
      buildAxisLabelFormatter(
        customYAxisTicks,
        yAxisLegendValues,
        formatCurrency,
      ),
    [customYAxisTicks, yAxisLegendValues],
  );

  const chartProps: LineChartProps = useMemo(
    () => ({
      lines,
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      xAxis: {
        show: true,
        showGrid: walletShowXGrid,
        ticks: customXAxisTicks,
        tickFormatter: xAxisTickFormatter,
      },
      yAxis: {
        show: true,
        showGrid: walletShowYGrid,
        ticks: customYAxisTicks,
        tickFormatter: yAxisTickFormatter,
      },
      enableScrubbing: walletEnableScrubbing,
      showTooltip: false,
      showCursor: walletShowHoverCursor,
      showCursorLabel: walletShowCursorLabel,
      onPointHover:
        walletEnableScrubbing && walletShowHoverCursor
          ? handlePointHover
          : undefined,
      onMarkerHover: walletEnableScrubbing ? handleMarkerHover : undefined,
      formatXLabel: formatDate,
      formatYLabel: formatCurrency,
      referenceLines:
        visibleReferenceLines.length > 0 ? visibleReferenceLines : undefined,
      valueLabels: walletShowValueLabels ? walletValueLabels : undefined,
      markers: walletShowMarkers ? walletMarkers : undefined,
    }),
    [
      lines,
      visibleReferenceLines,
      walletShowValueLabels,
      walletShowMarkers,
      walletEnableScrubbing,
      walletShowXGrid,
      walletShowYGrid,
      customXAxisTicks,
      customYAxisTicks,
      xAxisTickFormatter,
      yAxisTickFormatter,
      walletShowHoverCursor,
      walletShowCursorLabel,
      handlePointHover,
      handleMarkerHover,
    ],
  );

  const ChartComponent = {
    recharts: LineChartRecharts,
    victory: LineChartVictory,
    visx: LineChartVisx,
    d3: LineChartD3,
  }[activeLib];

  const isDark = colorScheme === 'dark';

  return (
    <div className='min-h-screen bg-base text-base p-32'>
      {/* Header row */}
      <div className='flex items-center justify-between mb-8'>
        <h1 className='heading-2'>Charts Library POC</h1>
        <IconButton
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          icon={isDark ? Sun : Moon}
          appearance='gray'
          size='md'
          tooltip
          onClick={() => onColorSchemeChange(isDark ? 'light' : 'dark')}
        />
      </div>
      <p className='text-muted mb-32 max-w-[700px] body-2'>
        Comparing Recharts, Victory, visx, and D3.js with a shared abstraction
        API. All charts render identical data through the same{' '}
        <code className='text-accent'>LineChartProps</code> interface.
      </p>

      {/* Library tabs */}
      <div className='mb-24'>
        <SegmentedControl
          selectedValue={activeLib}
          onSelectedChange={(v) => setActiveLib(v as LibKey)}
          tabLayout='fit'
        >
          {(Object.keys(LIB_LABELS) as LibKey[]).map((key) => (
            <SegmentedControlButton key={key} value={key}>
              {LIB_LABELS[key]}
            </SegmentedControlButton>
          ))}
        </SegmentedControl>
      </div>

      <WalletControls
        gradient={walletGradient}
        onGradientChange={setWalletGradient}
        enableScrubbing={walletEnableScrubbing}
        onEnableScrubbingChange={setWalletEnableScrubbing}
        showXGrid={walletShowXGrid}
        onShowXGridChange={setWalletShowXGrid}
        showYGrid={walletShowYGrid}
        onShowYGridChange={setWalletShowYGrid}
        useCustomXAxisData={walletUseCustomXAxisData}
        onUseCustomXAxisDataChange={setWalletUseCustomXAxisData}
        useCustomYAxisData={walletUseCustomYAxisData}
        onUseCustomYAxisDataChange={setWalletUseCustomYAxisData}
        xAxisDataInput={walletXAxisDataInput}
        onXAxisDataInputChange={setWalletXAxisDataInput}
        yAxisDataInput={walletYAxisDataInput}
        onYAxisDataInputChange={setWalletYAxisDataInput}
        useMultipleSeries={walletUseMultipleSeries}
        onUseMultipleSeriesChange={setWalletUseMultipleSeries}
        useSeriesLabels={walletUseSeriesLabels}
        onUseSeriesLabelsChange={setWalletUseSeriesLabels}
        refLinesEnabled={refLinesEnabled}
        onRefLineCheckedChange={(index, checked) => {
          setRefLinesEnabled((prev) => {
            const next = [...prev];
            next[index] = checked;
            return next;
          });
        }}
        showValueLabels={walletShowValueLabels}
        onShowValueLabelsChange={setWalletShowValueLabels}
        showMarkers={walletShowMarkers}
        onShowMarkersChange={setWalletShowMarkers}
        showHoverCursor={walletShowHoverCursor}
        onShowHoverCursorChange={setWalletShowHoverCursor}
        showCursorLabel={walletShowCursorLabel}
        onShowCursorLabelChange={setWalletShowCursorLabel}
      />

      {/* Chart */}
      <div
        className='rounded-lg pt-24 px-16 pb-16 mb-48 bg-surface'
        style={{ maxWidth: CHART_WIDTH + 32 }}
      >
        <div className='flex flex-col gap-4 mb-12 min-h-64 text-white'>
          <span className='body-4 opacity-60'>
            {walletUseMultipleSeries ? 'Bitcoin + Ethereum' : 'Bitcoin'}
            {hoveredPoint ? ` · ${formatDate(hoveredPoint.timestamp)}` : ''}
          </span>
          <div className='flex items-center gap-12'>
            <span className='heading-2'>
              {formatCurrency(
                hoveredPoint?.value ??
                  lines[0]?.data[lines[0].data.length - 1]?.value ??
                  0,
              )}
            </span>
            {hoveredMarker?.label && (
              <span
                className='body-3 font-semibold rounded-md px-8 py-4'
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#E87A2C',
                }}
              >
                {hoveredMarker.label}
              </span>
            )}
          </div>
          {!hoveredPoint && !hoveredMarker && (
            <span className='body-3' style={{ color: '#4ADE80' }}>
              +$134.43 12.31% &middot; 1 day
            </span>
          )}
          {(hoveredPoint || hoveredMarker) && (
            <span className='body-3 opacity-50'>
              {new Date(
                (hoveredMarker ?? hoveredPoint ?? { timestamp: 0 }).timestamp,
              ).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        <ChartComponent {...chartProps} />

        <div className='mt-12 flex flex-wrap items-center justify-between gap-8'>
          <span className='body-4 text-white/50'>
            Rendered with <strong>{LIB_LABELS[activeLib]}</strong>
          </span>
          <div className='flex flex-wrap items-center gap-12'>
            {lines.map((line) => (
              <span
                key={`series-legend-${line.id}`}
                className='body-4 text-white/60 flex items-center gap-6'
              >
                <span
                  className='inline-block h-8 w-8 rounded-full'
                  style={{ backgroundColor: line.color }}
                />
                {line.label ?? line.id}
              </span>
            ))}
          </div>
        </div>
      </div>

      <FeatureComparisonTable />

      <PerfBenchmark />
    </div>
  );
};

const SwitchControl = ({
  label,
  selected,
  onChange,
  disabled = false,
}: {
  label: string;
  selected: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) => (
  <label
    className={`flex items-center gap-8 body-4 text-base ${
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    }`}
  >
    <Switch
      size='sm'
      selected={selected}
      onChange={onChange}
      disabled={disabled}
    />
    {label}
  </label>
);

const WalletControls = ({
  gradient,
  onGradientChange,
  enableScrubbing,
  onEnableScrubbingChange,
  showXGrid,
  onShowXGridChange,
  showYGrid,
  onShowYGridChange,
  useCustomXAxisData,
  onUseCustomXAxisDataChange,
  useCustomYAxisData,
  onUseCustomYAxisDataChange,
  xAxisDataInput,
  onXAxisDataInputChange,
  yAxisDataInput,
  onYAxisDataInputChange,
  useMultipleSeries,
  onUseMultipleSeriesChange,
  useSeriesLabels,
  onUseSeriesLabelsChange,
  refLinesEnabled,
  onRefLineCheckedChange,
  showValueLabels,
  onShowValueLabelsChange,
  showMarkers,
  onShowMarkersChange,
  showHoverCursor,
  onShowHoverCursorChange,
  showCursorLabel,
  onShowCursorLabelChange,
}: {
  gradient: boolean;
  onGradientChange: (v: boolean) => void;
  enableScrubbing: boolean;
  onEnableScrubbingChange: (v: boolean) => void;
  showXGrid: boolean;
  onShowXGridChange: (v: boolean) => void;
  showYGrid: boolean;
  onShowYGridChange: (v: boolean) => void;
  useCustomXAxisData: boolean;
  onUseCustomXAxisDataChange: (v: boolean) => void;
  useCustomYAxisData: boolean;
  onUseCustomYAxisDataChange: (v: boolean) => void;
  xAxisDataInput: string;
  onXAxisDataInputChange: (v: string) => void;
  yAxisDataInput: string;
  onYAxisDataInputChange: (v: string) => void;
  useMultipleSeries: boolean;
  onUseMultipleSeriesChange: (v: boolean) => void;
  useSeriesLabels: boolean;
  onUseSeriesLabelsChange: (v: boolean) => void;
  refLinesEnabled: boolean[];
  onRefLineCheckedChange: (index: number, checked: boolean) => void;
  showValueLabels: boolean;
  onShowValueLabelsChange: (v: boolean) => void;
  showMarkers: boolean;
  onShowMarkersChange: (v: boolean) => void;
  showHoverCursor: boolean;
  onShowHoverCursorChange: (v: boolean) => void;
  showCursorLabel: boolean;
  onShowCursorLabelChange: (v: boolean) => void;
}) => (
  <div className='flex gap-32 mb-24 flex-wrap items-start'>
    <fieldset className='border border-muted rounded-md px-16 py-12'>
      <legend className='body-4 text-muted px-4'>Line Style</legend>
      <div className='flex gap-16 flex-wrap'>
        <SwitchControl
          label='Gradient fill'
          selected={gradient}
          onChange={onGradientChange}
        />
        <SwitchControl
          label='Enable scrubbing'
          selected={enableScrubbing}
          onChange={onEnableScrubbingChange}
        />
      </div>
    </fieldset>

    <fieldset className='border border-muted rounded-md px-16 py-12'>
      <legend className='body-4 text-muted px-4'>Grid</legend>
      <div className='flex gap-16 flex-wrap'>
        <SwitchControl
          label='Show X grid'
          selected={showXGrid}
          onChange={onShowXGridChange}
        />
        <SwitchControl
          label='Show Y grid'
          selected={showYGrid}
          onChange={onShowYGridChange}
        />
      </div>
    </fieldset>

    <fieldset className='border border-muted rounded-md px-16 py-12 min-w-400'>
      <legend className='body-4 text-muted px-4'>Axis data</legend>
      <div className='flex flex-col gap-12'>
        <div className='flex gap-16 flex-wrap'>
          <SwitchControl
            label='Custom X axis data'
            selected={useCustomXAxisData}
            onChange={onUseCustomXAxisDataChange}
          />
          <SwitchControl
            label='Custom Y axis data'
            selected={useCustomYAxisData}
            onChange={onUseCustomYAxisDataChange}
          />
        </div>
        <label className='flex flex-col gap-6'>
          <span className='body-4 text-muted'>
            X axis labels (comma-separated)
          </span>
          <input
            value={xAxisDataInput}
            onChange={(event) => onXAxisDataInputChange(event.target.value)}
            className='bg-base border border-muted rounded-md px-8 py-6 body-4 text-base'
            disabled={!useCustomXAxisData}
          />
        </label>
        <label className='flex flex-col gap-6'>
          <span className='body-4 text-muted'>
            Y axis labels (comma-separated)
          </span>
          <input
            value={yAxisDataInput}
            onChange={(event) => onYAxisDataInputChange(event.target.value)}
            className='bg-base border border-muted rounded-md px-8 py-6 body-4 text-base'
            disabled={!useCustomYAxisData}
          />
        </label>
      </div>
    </fieldset>

    <fieldset className='border border-muted rounded-md px-16 py-12'>
      <legend className='body-4 text-muted px-4'>Series</legend>
      <div className='flex gap-16 flex-wrap'>
        <SwitchControl
          label='Multiple series (add ETH)'
          selected={useMultipleSeries}
          onChange={onUseMultipleSeriesChange}
        />
        <SwitchControl
          label='Friendly labels'
          selected={useSeriesLabels}
          onChange={onUseSeriesLabelsChange}
        />
      </div>
    </fieldset>

    <fieldset className='border border-muted rounded-md px-16 py-12'>
      <legend className='body-4 text-muted px-4'>Overlays</legend>
      <div className='flex gap-16 flex-wrap'>
        <SwitchControl
          label='Hover cursor'
          selected={showHoverCursor}
          onChange={onShowHoverCursorChange}
          disabled={!enableScrubbing}
        />
        <SwitchControl
          label='Cursor label'
          selected={showCursorLabel}
          onChange={onShowCursorLabelChange}
          disabled={!enableScrubbing}
        />
        <SwitchControl
          label='Value labels'
          selected={showValueLabels}
          onChange={onShowValueLabelsChange}
        />
        <SwitchControl
          label='Dot markers'
          selected={showMarkers}
          onChange={onShowMarkersChange}
        />
      </div>
    </fieldset>

    <fieldset className='border border-muted rounded-md px-16 py-12'>
      <legend className='body-4 text-muted px-4'>Reference lines</legend>
      <div className='flex flex-wrap items-center gap-12'>
        {walletReferenceLines.map((rl, i) => (
          <label
            key={`ref-${i}`}
            className='flex items-center gap-8 cursor-pointer'
          >
            <Checkbox
              className='shrink-0'
              checked={refLinesEnabled[i] ?? false}
              onCheckedChange={(checked) => onRefLineCheckedChange(i, checked)}
            />
            <span className='body-4 text-base whitespace-nowrap'>
              <span>{rl.domain ?? `Level ${i + 1}`}</span>
              <span className='text-muted'>
                {' '}
                ({getReferenceLineStyleCaption(rl.style)} · {rl.label})
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  </div>
);
