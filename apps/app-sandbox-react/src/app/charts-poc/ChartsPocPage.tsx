import { useState, useMemo } from 'react';
import { ChartControls } from './ChartControls';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  DATASET_LABELS,
  LIB_LABELS,
  VARIANT_LABELS,
} from './constants';
import type { DatasetKey, LibKey, VariantKey } from './constants';
import { FeatureComparisonTable } from './FeatureComparisonTable';
import {
  singleLineBtc,
  multiLine,
  highDensityBtc,
  formatCurrency,
  formatDate,
  formatDateTime,
  walletVariant,
} from './mockData';
import { LineChartRecharts } from './recharts';
import type { LineChartProps } from './types';
import { LineChartVictory } from './victory';
import { LineChartVisx } from './visx';

export const ChartsPocPage = () => {
  const [activeLib, setActiveLib] = useState<LibKey>('recharts');
  const [variant, setVariant] = useState<VariantKey>('full');
  const [dataset, setDataset] = useState<DatasetKey>('single');
  const [showGrid, setShowGrid] = useState(true);
  const [showXAxis, setShowXAxis] = useState(true);
  const [showYAxis, setShowYAxis] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const isWallet = variant === 'wallet';

  const lines = useMemo(() => {
    if (isWallet) return walletVariant.lines;
    switch (dataset) {
      case 'single':
        return singleLineBtc;
      case 'multi':
        return multiLine;
      case 'dense':
        return highDensityBtc;
    }
  }, [dataset, isWallet]);

  const isDense = dataset === 'dense';

  const chartProps: LineChartProps = isWallet
    ? {
        ...walletVariant,
        width: CHART_WIDTH,
        height: CHART_HEIGHT,
      }
    : {
        lines,
        width: CHART_WIDTH,
        height: CHART_HEIGHT,
        showGrid,
        showXAxis,
        showYAxis,
        showTooltip,
        showCursor,
        formatXLabel: isDense ? formatDateTime : formatDate,
        formatYLabel: formatCurrency,
      };

  const ChartComponent = {
    recharts: LineChartRecharts,
    victory: LineChartVictory,
    visx: LineChartVisx,
  }[activeLib];

  return (
    <div
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
        Comparing Recharts, Victory, and visx with a shared abstraction API. All
        charts render identical data through the same{' '}
        <code>LineChartProps</code> interface.
      </p>

      {/* Variant + Library tabs */}
      <div
        style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}
      >
        <div style={{ display: 'flex', gap: 0 }}>
          {(Object.keys(VARIANT_LABELS) as VariantKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setVariant(key)}
              style={{
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: variant === key ? 700 : 400,
                backgroundColor:
                  variant === key ? 'var(--background-surface)' : 'transparent',
                color:
                  variant === key ? 'var(--text-base)' : 'var(--text-muted)',
                border: '1px solid var(--border-muted)',
                borderBottom:
                  variant === key
                    ? '2px solid var(--text-accent)'
                    : '1px solid var(--border-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {VARIANT_LABELS[key]}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 0 }}>
          {(Object.keys(LIB_LABELS) as LibKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveLib(key)}
              style={{
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: activeLib === key ? 700 : 400,
                backgroundColor:
                  activeLib === key
                    ? 'var(--background-surface)'
                    : 'transparent',
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
      </div>

      {!isWallet && (
        <ChartControls
          dataset={dataset}
          onDatasetChange={setDataset}
          showGrid={showGrid}
          onShowGridChange={setShowGrid}
          showXAxis={showXAxis}
          onShowXAxisChange={setShowXAxis}
          showYAxis={showYAxis}
          onShowYAxisChange={setShowYAxis}
          showTooltip={showTooltip}
          onShowTooltipChange={setShowTooltip}
          showCursor={showCursor}
          onShowCursorChange={setShowCursor}
        />
      )}

      {/* Chart */}
      <div
        style={{
          backgroundColor: isWallet ? '#1A1A2E' : 'var(--background-surface)',
          border: isWallet ? 'none' : '1px solid var(--border-muted)',
          borderRadius: 12,
          padding: isWallet ? '24px 16px 16px' : 16,
          marginBottom: 48,
          maxWidth: CHART_WIDTH + 32,
        }}
      >
        {isWallet && (
          <div
            style={{
              color: '#fff',
              marginBottom: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 11, opacity: 0.6 }}>Bitcoin</span>
            <span style={{ fontSize: 24, fontWeight: 700 }}>
              {formatCurrency(
                lines[0]?.data[lines[0].data.length - 1]?.value ?? 0,
              )}
            </span>
            <span style={{ fontSize: 13, color: '#4ADE80' }}>
              +$134.43 12.31% &middot; 1 day
            </span>
          </div>
        )}

        {!isWallet && (
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              marginBottom: 12,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              <strong>{LIB_LABELS[activeLib]}</strong> &middot;{' '}
              {DATASET_LABELS[dataset]}
            </span>
            <span>
              {lines.reduce((acc, l) => acc + l.data.length, 0)} data points
            </span>
          </div>
        )}

        <ChartComponent {...chartProps} />

        {isWallet && (
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
        )}
      </div>

      <FeatureComparisonTable />
    </div>
  );
};
