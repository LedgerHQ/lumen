import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader, TokenTable } from '../shared';
import { useResolvedTheme } from '../useResolvedTheme';

const meta = {
  id: 'react-breakpoints',
  title: 'Foundations/Breakpoints',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const BreakpointTable = () => {
  const theme = useResolvedTheme();
  const breakpoints = Object.entries(theme.breakpoints);

  return (
    <TokenTable
      headers={['Name', 'Min width', 'From (≥)', 'Below (<)']}
      rows={breakpoints.map(([name, px]) => ({
        key: name,
        cells: [
          <code>{name}</code>,
          <code>{`${px}px`}</code>,
          <code>{`${name}:`}</code>,
          <code>{`max-${name}:`}</code>,
        ],
      }))}
    />
  );
};

export const Default: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Breakpoints'
        description='Viewport widths at which layouts adapt. Use the name as a Tailwind variant prefix.'
      />
      <BreakpointTable />
    </div>
  ),
};
