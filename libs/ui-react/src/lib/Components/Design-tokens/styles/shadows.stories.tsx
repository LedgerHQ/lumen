import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader, TokenTable } from '../shared';
import { useResolvedTheme } from '../useResolvedTheme';

const meta: Meta = {
  id: 'react-shadows',
  title: 'Foundations/Styles/Shadows',
};

export default meta;
type Story = StoryObj;

type ShadowDefinition = {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadDistance: number;
  color: string;
};

const formatShadow = (definitions: readonly ShadowDefinition[]): string =>
  definitions
    .map(
      ({ offsetX, offsetY, blurRadius, spreadDistance, color }) =>
        `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadDistance}px ${color}`,
    )
    .join(', ');

const ShadowTable = () => {
  const rows = Object.entries(useResolvedTheme().shadows).map(
    ([key, value]) => ({
      key,
      cells: [
        <code>{`--shadow-${key}`}</code>,
        <code>{`shadow-${key}`}</code>,
        <code style={{ fontSize: 11 }}>{formatShadow(value)}</code>,
        <div style={{ paddingBlock: 12 }}>
          <div
            style={{
              width: 64,
              height: 64,
              backgroundColor: '#fff',
              borderRadius: 8,
              boxShadow: formatShadow(value),
            }}
          />
        </div>,
      ],
    }),
  );

  return (
    <TokenTable
      headers={['CSS token name', 'Tailwind utility', 'Value', 'Sample']}
      rows={rows}
    />
  );
};

export const Shadows: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Shadow'
        description='Tailwind classes for controlling the shadow of an element.'
      />
      <ShadowTable />
    </div>
  ),
};
