import type { ReactNode } from 'react';
import { stripSizePrefix } from '../formatToken';
import { TokenTable } from '../shared';
import { useResolvedTheme } from '../useResolvedTheme';

type ResolvedTheme = ReturnType<typeof useResolvedTheme>;
type DimensionTokens = Record<string, number | string>;

/**
 * Generic table for primitive dimension scales (spacing, width, height, size).
 * Each scale only differs by its token source, label formatting and sample, so
 * those are injected while the row/table assembly stays shared.
 */
export const DimensionTable = ({
  select,
  cssToken,
  utility,
  renderSample,
  formatValue = (value) => `${value}px`,
}: {
  select: (theme: ResolvedTheme) => DimensionTokens;
  cssToken: (key: string) => string;
  utility: (key: string) => string;
  renderSample: (value: number | string, accentColor: string) => ReactNode;
  formatValue?: (value: number | string) => string;
}) => {
  const theme = useResolvedTheme();
  const accentColor = theme.colors.bg.accent;

  const rows = Object.entries(select(theme)).map(([key, value]) => ({
    key,
    cells: [
      <code>{cssToken(key)}</code>,
      <code>{utility(key)}</code>,
      <code>{formatValue(value)}</code>,
      renderSample(value, accentColor),
    ],
  }));

  return (
    <TokenTable
      headers={['CSS token name', 'Tailwind utility', 'Value', 'Sample']}
      rows={rows}
    />
  );
};

const SizeSample = ({
  value,
  accentColor,
}: {
  value: number | string;
  accentColor: string;
}) => {
  const numericValue = value === '100%' ? 100 : Number(value);

  if (numericValue >= 100) {
    return (
      <span style={{ fontSize: 10, color: 'grey' }}>Too large to show!</span>
    );
  }

  return (
    <div
      style={{
        width: numericValue,
        height: numericValue,
        backgroundColor: accentColor,
        borderRadius: 4,
      }}
    />
  );
};

const formatSizeToken = (key: string): string =>
  key === 'full' ? '--size-full' : `--size-${stripSizePrefix(key)}`;

const formatSizeValue = (value: number | string): string =>
  value === '100%' ? '100%' : `${value}px`;

/**
 * Table for the shared `sizes` scale, used by the Width, Height and Size docs.
 * Only the Tailwind utility prefix (`w` / `h` / `size`) differs between them.
 */
export const SizeTable = ({
  utilityPrefix,
}: {
  utilityPrefix: 'w' | 'h' | 'size';
}) => (
  <DimensionTable
    select={(theme) => theme.sizes}
    cssToken={formatSizeToken}
    utility={(key) =>
      key === 'full'
        ? `${utilityPrefix}-full`
        : `${utilityPrefix}-${stripSizePrefix(key)}`
    }
    formatValue={formatSizeValue}
    renderSample={(value, accentColor) => (
      <SizeSample value={value} accentColor={accentColor} />
    )}
  />
);
