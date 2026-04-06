import {
  Checkbox,
  IconButton,
  SegmentedControl,
  SegmentedControlButton,
  Switch,
} from '@ledgerhq/lumen-ui-react';
import { Moon, Sun } from '@ledgerhq/lumen-ui-react/symbols';
import { useState, useMemo, useCallback } from 'react';
import { CHART_HEIGHT, CHART_WIDTH, LIB_LABELS } from './constants';
import type { LibKey } from './constants';
import { LineChartD3 } from './d3';
import { FeatureComparisonTable } from './FeatureComparisonTable';
import {
  formatCurrency,
  formatDate,
  walletLines,
  walletReferenceLines,
  walletValueLabels,
  walletMarkers,
} from './mockData';
import { PerfBenchmark } from './PerfBenchmark';
import { LineChartRecharts } from './recharts';
import type { DataPoint, LineChartProps, MarkerConfig } from './types';
import { getReferenceLineStyleCaption } from './utils';
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
  const [refLinesEnabled, setRefLinesEnabled] = useState<boolean[]>(() =>
    walletReferenceLines.map(() => true),
  );
  const [walletShowValueLabels, setWalletShowValueLabels] = useState(true);
  const [walletShowMarkers, setWalletShowMarkers] = useState(true);
  const [walletShowHoverCursor, setWalletShowHoverCursor] = useState(true);
  const [walletShowCursorLabel, setWalletShowCursorLabel] = useState(true);
  const [walletDimAfterCursor, setWalletDimAfterCursor] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<MarkerConfig | null>(null);

  const handlePointHover = useCallback((point: DataPoint | null) => {
    setHoveredPoint(point);
  }, []);

  const handleMarkerHover = useCallback((marker: MarkerConfig | null) => {
    setHoveredMarker(marker);
  }, []);

  const lines = useMemo(
    () => walletLines.map((l) => ({ ...l, showGradient: walletGradient })),
    [walletGradient],
  );

  const visibleReferenceLines = useMemo(
    () => walletReferenceLines.filter((_, i) => refLinesEnabled[i]),
    [refLinesEnabled],
  );

  const chartProps: LineChartProps = useMemo(
    () => ({
      lines,
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      showGrid: false,
      showXAxis: false,
      showYAxis: false,
      showTooltip: false,
      showCursor: walletShowHoverCursor,
      showCursorLabel: walletShowCursorLabel,
      dimAfterCursor: walletDimAfterCursor,
      onPointHover: walletShowHoverCursor ? handlePointHover : undefined,
      onMarkerHover: handleMarkerHover,
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
      walletShowHoverCursor,
      walletShowCursorLabel,
      walletDimAfterCursor,
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
        dimAfterCursor={walletDimAfterCursor}
        onDimAfterCursorChange={setWalletDimAfterCursor}
      />

      {/* Chart */}
      <div
        className='rounded-lg pt-24 px-16 pb-16 mb-48'
        style={{ backgroundColor: '#1A1A2E', maxWidth: CHART_WIDTH + 32 }}
      >
        <div className='flex flex-col gap-4 mb-12 min-h-64 text-white'>
          <span className='body-4 opacity-60'>
            Bitcoin
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

        <div className='flex justify-center gap-4 mt-12'>
          <span className='body-4 text-white/50'>
            Rendered with <strong>{LIB_LABELS[activeLib]}</strong>
          </span>
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
}: {
  label: string;
  selected: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label className='flex items-center gap-8 body-4 cursor-pointer text-base'>
    <Switch size='sm' selected={selected} onChange={onChange} />
    {label}
  </label>
);

const WalletControls = ({
  gradient,
  onGradientChange,
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
  dimAfterCursor,
  onDimAfterCursorChange,
}: {
  gradient: boolean;
  onGradientChange: (v: boolean) => void;
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
  dimAfterCursor: boolean;
  onDimAfterCursorChange: (v: boolean) => void;
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
          label='Dim after cursor'
          selected={dimAfterCursor}
          onChange={onDimAfterCursorChange}
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
        />
        <SwitchControl
          label='Cursor label'
          selected={showCursorLabel}
          onChange={onShowCursorLabelChange}
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

    <fieldset className='border border-muted rounded-md px-16 py-12 max-w-400'>
      <legend className='body-4 text-muted px-4'>Reference lines</legend>
      <div className='flex flex-col gap-12'>
        {walletReferenceLines.map((rl, i) => (
          <label
            key={`ref-${i}`}
            className='flex items-start gap-12 cursor-pointer'
          >
            <Checkbox
              className='mt-2 shrink-0'
              checked={refLinesEnabled[i] ?? false}
              onCheckedChange={(checked) => onRefLineCheckedChange(i, checked)}
            />
            <span className='flex flex-col gap-4 min-w-0'>
              <span className='body-3 text-base'>
                {rl.domain ?? `Level ${i + 1}`}
              </span>
              <span className='body-4 text-muted'>
                {getReferenceLineStyleCaption(rl.style)} · {rl.label}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  </div>
);
