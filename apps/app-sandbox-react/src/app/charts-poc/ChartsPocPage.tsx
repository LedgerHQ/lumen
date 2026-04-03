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
import { LineChartRecharts } from './recharts';
import type { DataPoint, LineChartProps } from './types';
import { LineChartVictory } from './victory';
import { LineChartVisx } from './visx';

export const ChartsPocPage = () => {
  const [activeLib, setActiveLib] = useState<LibKey>('recharts');

  const [walletGradient, setWalletGradient] = useState(false);
  const [walletRefLineCount, setWalletRefLineCount] = useState(
    walletReferenceLines.length,
  );
  const [walletShowValueLabels, setWalletShowValueLabels] = useState(true);
  const [walletShowMarkers, setWalletShowMarkers] = useState(true);
  const [walletShowHoverCursor, setWalletShowHoverCursor] = useState(true);
  const [walletShowCursorLabel, setWalletShowCursorLabel] = useState(true);
  const [walletDimAfterCursor, setWalletDimAfterCursor] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const handlePointHover = useCallback((point: DataPoint | null) => {
    setHoveredPoint(point);
  }, []);

  const lines = useMemo(
    () => walletLines.map((l) => ({ ...l, showGradient: walletGradient })),
    [walletGradient],
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
      formatXLabel: formatDate,
      formatYLabel: formatCurrency,
      referenceLines:
        walletRefLineCount > 0
          ? walletReferenceLines.slice(0, walletRefLineCount)
          : undefined,
      valueLabels: walletShowValueLabels ? walletValueLabels : undefined,
      markers: walletShowMarkers ? walletMarkers : undefined,
    }),
    [
      lines,
      walletRefLineCount,
      walletShowValueLabels,
      walletShowMarkers,
      walletShowHoverCursor,
      walletShowCursorLabel,
      walletDimAfterCursor,
      handlePointHover,
    ],
  );

  const ChartComponent = {
    recharts: LineChartRecharts,
    victory: LineChartVictory,
    visx: LineChartVisx,
    d3: LineChartD3,
  }[activeLib];

  return (
    <div
      className='bg-[#f00]'
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background-base)',
        color: 'var(--text-base)',
        padding: 32,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Charts Library POC
      </h1>
      <p
        style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 700 }}
      >
        Comparing Recharts, Victory, visx, and D3.js with a shared abstraction
        API. All charts render identical data through the same{' '}
        <code>LineChartProps</code> interface.
      </p>

      {/* Library tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
        {(Object.keys(LIB_LABELS) as LibKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveLib(key)}
            style={{
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: activeLib === key ? 700 : 400,
              backgroundColor:
                activeLib === key ? 'var(--background-surface)' : 'transparent',
              color:
                activeLib === key ? 'var(--text-base)' : 'var(--text-muted)',
              border: '1px solid var(--border-muted)',
              borderBottom:
                activeLib === key
                  ? '2px solid var(--text-base)'
                  : '1px solid var(--border-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {LIB_LABELS[key]}
          </button>
        ))}
      </div>

      <WalletControls
        gradient={walletGradient}
        onGradientChange={setWalletGradient}
        refLineCount={walletRefLineCount}
        onRefLineCountChange={setWalletRefLineCount}
        maxRefLines={walletReferenceLines.length}
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
        style={{
          backgroundColor: '#1A1A2E',
          borderRadius: 12,
          padding: '24px 16px 16px',
          marginBottom: 48,
          maxWidth: CHART_WIDTH + 32,
        }}
      >
        <div
          style={{
            color: '#fff',
            marginBottom: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minHeight: 64,
          }}
        >
          <span style={{ fontSize: 11, opacity: 0.6 }}>
            Bitcoin
            {hoveredPoint ? ` · ${formatDate(hoveredPoint.timestamp)}` : ''}
          </span>
          <span style={{ fontSize: 24, fontWeight: 700 }}>
            {formatCurrency(
              hoveredPoint?.value ??
                lines[0]?.data[lines[0].data.length - 1]?.value ??
                0,
            )}
          </span>
          {!hoveredPoint && (
            <span style={{ fontSize: 13, color: '#4ADE80' }}>
              +$134.43 12.31% &middot; 1 day
            </span>
          )}
          {hoveredPoint && (
            <span style={{ fontSize: 13, opacity: 0.5 }}>
              {new Date(hoveredPoint.timestamp).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        <ChartComponent {...chartProps} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            marginTop: 12,
          }}
        >
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            Rendered with <strong>{LIB_LABELS[activeLib]}</strong>
          </span>
        </div>
      </div>

      <FeatureComparisonTable />
    </div>
  );
};

const Toggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      cursor: 'pointer',
      color: 'var(--text-base)',
    }}
  >
    <input
      type='checkbox'
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ accentColor: 'var(--background-accent)' }}
    />
    {label}
  </label>
);

const WalletControls = ({
  gradient,
  onGradientChange,
  refLineCount,
  onRefLineCountChange,
  maxRefLines,
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
  refLineCount: number;
  onRefLineCountChange: (v: number) => void;
  maxRefLines: number;
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
  <div
    style={{
      display: 'flex',
      gap: 32,
      marginBottom: 24,
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    }}
  >
    <fieldset
      style={{
        border: '1px solid var(--border-muted)',
        borderRadius: 8,
        padding: '12px 16px',
      }}
    >
      <legend
        style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 4px' }}
      >
        Line Style
      </legend>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Toggle
          label='Gradient fill'
          checked={gradient}
          onChange={onGradientChange}
        />
        <Toggle
          label='Dim after cursor'
          checked={dimAfterCursor}
          onChange={onDimAfterCursorChange}
        />
      </div>
    </fieldset>

    <fieldset
      style={{
        border: '1px solid var(--border-muted)',
        borderRadius: 8,
        padding: '12px 16px',
      }}
    >
      <legend
        style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 4px' }}
      >
        Overlays
      </legend>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Toggle
          label='Hover cursor'
          checked={showHoverCursor}
          onChange={onShowHoverCursorChange}
        />
        <Toggle
          label='Cursor label'
          checked={showCursorLabel}
          onChange={onShowCursorLabelChange}
        />
        <Toggle
          label='Value labels'
          checked={showValueLabels}
          onChange={onShowValueLabelsChange}
        />
        <Toggle
          label='Dot markers'
          checked={showMarkers}
          onChange={onShowMarkersChange}
        />
      </div>
    </fieldset>

    <fieldset
      style={{
        border: '1px solid var(--border-muted)',
        borderRadius: 8,
        padding: '12px 16px',
      }}
    >
      <legend
        style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 4px' }}
      >
        Reference Lines ({refLineCount})
      </legend>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>0</span>
        <input
          type='range'
          min={0}
          max={maxRefLines}
          value={refLineCount}
          onChange={(e) => onRefLineCountChange(Number(e.target.value))}
          style={{ width: 120, accentColor: 'var(--background-accent)' }}
        />
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {maxRefLines}
        </span>
      </div>
      <div
        style={{
          marginTop: 8,
          display: 'flex',
          gap: 12,
          fontSize: 11,
          color: 'var(--text-muted)',
        }}
      >
        {walletReferenceLines.slice(0, refLineCount).map((rl, i) => (
          <span key={i} style={{ color: rl.color }}>
            {rl.style} @ {rl.label}
          </span>
        ))}
      </div>
    </fieldset>
  </div>
);
