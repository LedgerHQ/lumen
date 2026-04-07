import {
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
import { LineChartVictory } from './victory';
import { LineChartVisx } from './visx';

type ChartsPocPageProps = {
  colorScheme: 'light' | 'dark';
  onColorSchemeChange: (scheme: 'light' | 'dark') => void;
};

export const ChartsPocPage = ({
  colorScheme,
  onColorSchemeChange,
}: ChartsPocPageProps) => {
  const [activeLib, setActiveLib] = useState<LibKey>('recharts');

  const [walletGradient, setWalletGradient] = useState(false);
  const [walletShowRefLines, setWalletShowRefLines] = useState(true);
  const [walletShowValueLabels, setWalletShowValueLabels] = useState(true);
  const [walletShowMarkers, setWalletShowMarkers] = useState(true);
  const [walletEnableScrubbing, setWalletEnableScrubbing] = useState(true);
  const [walletShowXGrid, setWalletShowXGrid] = useState(true);
  const [walletShowYGrid, setWalletShowYGrid] = useState(true);
  const [walletShowXLabels, setWalletShowXLabels] = useState(true);
  const [walletShowYLabels, setWalletShowYLabels] = useState(true);
  const [walletShowHoverCursor, setWalletShowHoverCursor] = useState(true);
  const [walletShowCursorLabel, setWalletShowCursorLabel] = useState(true);
  const [walletUseMultipleSeries, setWalletUseMultipleSeries] = useState(false);
  const [walletUseSeriesLabels, setWalletUseSeriesLabels] = useState(true);
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

  const visibleReferenceLines = useMemo(
    () => (walletShowRefLines ? walletReferenceLines : []),
    [walletShowRefLines],
  );

  const chartProps: LineChartProps = useMemo(
    () => ({
      lines,
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      xAxis: {
        show: true,
        showGrid: walletShowXGrid,
        showLabels: walletShowXLabels,
      },
      yAxis: {
        show: true,
        showGrid: walletShowYGrid,
        showLabels: walletShowYLabels,
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
      walletShowXLabels,
      walletShowYLabels,
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
        showXLabels={walletShowXLabels}
        onShowXLabelsChange={setWalletShowXLabels}
        showYLabels={walletShowYLabels}
        onShowYLabelsChange={setWalletShowYLabels}
        useMultipleSeries={walletUseMultipleSeries}
        onUseMultipleSeriesChange={setWalletUseMultipleSeries}
        useSeriesLabels={walletUseSeriesLabels}
        onUseSeriesLabelsChange={setWalletUseSeriesLabels}
        showRefLines={walletShowRefLines}
        onShowRefLinesChange={setWalletShowRefLines}
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
  showXLabels,
  onShowXLabelsChange,
  showYLabels,
  onShowYLabelsChange,
  useMultipleSeries,
  onUseMultipleSeriesChange,
  useSeriesLabels,
  onUseSeriesLabelsChange,
  showRefLines,
  onShowRefLinesChange,
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
  showXLabels: boolean;
  onShowXLabelsChange: (v: boolean) => void;
  showYLabels: boolean;
  onShowYLabelsChange: (v: boolean) => void;
  useMultipleSeries: boolean;
  onUseMultipleSeriesChange: (v: boolean) => void;
  useSeriesLabels: boolean;
  onUseSeriesLabelsChange: (v: boolean) => void;
  showRefLines: boolean;
  onShowRefLinesChange: (v: boolean) => void;
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
      <legend className='body-4 text-muted px-4'>Grid & axis labels</legend>
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
        <SwitchControl
          label='Show X labels'
          selected={showXLabels}
          onChange={onShowXLabelsChange}
        />
        <SwitchControl
          label='Show Y labels'
          selected={showYLabels}
          onChange={onShowYLabelsChange}
        />
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
        <SwitchControl
          label='Reference lines'
          selected={showRefLines}
          onChange={onShowRefLinesChange}
        />
      </div>
    </fieldset>
  </div>
);
