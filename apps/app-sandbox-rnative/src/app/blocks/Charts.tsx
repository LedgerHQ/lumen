import { Box, Checkbox, Text } from '@ledgerhq/lumen-ui-rnative';
import { useMemo, useState } from 'react';
import { LineChartD3RNative, type DataPoint } from '../charts';

const DAY_MS = 24 * 60 * 60 * 1000;

const createSeriesA = (startTs: number): DataPoint[] => {
  return [
    { timestamp: startTs + DAY_MS * 0, value: 58 },
    { timestamp: startTs + DAY_MS * 1, value: 64 },
    { timestamp: startTs + DAY_MS * 2, value: 61 },
    { timestamp: startTs + DAY_MS * 3, value: 66 },
    { timestamp: startTs + DAY_MS * 4, value: 72 },
    { timestamp: startTs + DAY_MS * 5, value: 69 },
    { timestamp: startTs + DAY_MS * 6, value: 75 },
    { timestamp: startTs + DAY_MS * 7, value: 73 },
    { timestamp: startTs + DAY_MS * 8, value: 78 },
    { timestamp: startTs + DAY_MS * 9, value: 76 },
    { timestamp: startTs + DAY_MS * 10, value: 81 },
    { timestamp: startTs + DAY_MS * 11, value: 79 },
    { timestamp: startTs + DAY_MS * 12, value: 84 },
    { timestamp: startTs + DAY_MS * 13, value: 82 },
  ];
};

const formatShortDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

type ChartsProps = {
  onScrubbingChange?: (isScrubbing: boolean) => void;
};

export const Charts = ({ onScrubbingChange }: ChartsProps) => {
  const [showGradient, setShowGradient] = useState<boolean>(true);
  const [activePointLabel, setActivePointLabel] = useState<string>(
    'Press and hold the chart to scrub',
  );

  const startTs = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime() - DAY_MS * 13;
  }, []);

  const seriesA = useMemo(() => createSeriesA(startTs), [startTs]);
  return (
    <Box lx={{ gap: 's12' }}>
      <Text typography='body3' lx={{ color: 'muted' }}>
        Same LineChart API as web D3 chart, with press interactions on RN.
      </Text>
      <Checkbox
        aria-valuetext='toggle gradient'
        label='Enable gradient'
        checked={showGradient}
        onCheckedChange={setShowGradient}
      />

      <LineChartD3RNative
        width={340}
        height={220}
        series={[
          {
            id: 'btc',
            label: 'BTC',
            data: seriesA,
            color: '#E87A2C',
            showGradient,
            curve: 'natural',
            connectNulls: true,
          },
        ]}
        xAxis={{ tickCount: 4, showGrid: false }}
        yAxis={{ tickCount: 5, showGrid: true }}
        formatXLabel={formatShortDate}
        formatYLabel={(v) => `${Math.round(v)}`}
        referenceLines={[
          { axis: 'y', value: 80, style: 'dashed' },
          { axis: 'x', value: startTs + DAY_MS * 9, style: 'dotted' },
        ]}
        markers={[
          {
            timestamp: startTs + DAY_MS * 12,
            value: 84,
            label: 'Buy',
            color: '#22C55E',
            variant: 'outlined',
          },
        ]}
        valueLabels={[
          { type: 'max', label: 'Peak' },
          { type: 'min', label: 'Low' },
        ]}
        enableScrubbing
        showTooltip
        showCursor
        showCursorLabel
        onScrubbingChange={onScrubbingChange}
        chartAccessibilityLabel='Asset prices over the last 14 days'
        onPointHover={(point, lineId) => {
          if (!point || point.value == null) {
            setActivePointLabel('Press and hold the chart to scrub');
            return;
          }
          setActivePointLabel(
            `${lineId.toUpperCase()} ${formatShortDate(point.timestamp)}: ${point.value}`,
          );
        }}
      />

      <Text typography='body3' lx={{ color: 'muted' }}>
        {activePointLabel}
      </Text>
    </Box>
  );
};
