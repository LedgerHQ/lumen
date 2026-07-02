import type { Meta, StoryObj } from '@storybook/react-vite';
import { humanize, toKebab } from '../formatToken';
import { SectionHeader, TokenTable } from '../shared';
import { useResolvedTheme } from '../useResolvedTheme';

const meta: Meta = {
  id: 'react-gradients',
  title: 'Foundations/Styles/Gradients',
};

export default meta;
type Story = StoryObj;

const StaticGradients = () => (
  <div className='space-y-32'>
    <div>
      <h4 className='mb-16 heading-5 text-base'>Directional Gradients</h4>
      <div className='grid grid-cols-1 gap-16 sm:grid-cols-2'>
        {[
          { name: 'Top', class: 'bg-gradient-top' },
          { name: 'Bottom', class: 'bg-gradient-bottom' },
        ].map(({ name, class: gradientClass }) => (
          <div key={name}>
            <div
              className={`h-96 rounded-lg border border-muted-subtle ${gradientClass}`}
            />
            <div className='mt-8 body-2 text-base'>{name}</div>
            <div className='mt-8 body-4 text-muted'>{gradientClass}</div>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h4 className='mb-16 heading-5 text-base'>Status Gradients</h4>
      <div className='grid grid-cols-1 gap-16 sm:grid-cols-3'>
        {[
          { name: 'Error', class: 'bg-gradient-error' },
          { name: 'Success', class: 'bg-gradient-success' },
          { name: 'Muted', class: 'bg-gradient-muted' },
        ].map(({ name, class: gradientClass }) => (
          <div key={name}>
            <div
              className={`h-224 rounded-lg border border-muted-subtle ${gradientClass}`}
            />
            <div className='mt-8 body-2 text-base'>{name}</div>
            <div className='mt-8 body-4 text-muted'>{gradientClass}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const GradientTable = () => {
  const rows = Object.entries(useResolvedTheme().colors.gradients.crypto).map(
    ([key, stops]) => {
      const gradient = `linear-gradient(161deg, ${stops
        .map((stop) => stop.color)
        .join(', ')})`;

      return {
        key,
        cells: [
          humanize(key),
          <code>{`bg-gradient-${toKebab(key)}`}</code>,
          <code>{gradient}</code>,
          <div
            style={{
              width: 48,
              height: 24,
              borderRadius: 6,
              backgroundImage: gradient,
            }}
          />,
        ],
      };
    },
  );

  return (
    <TokenTable
      headers={['Name', 'Tailwind utility', 'Value', 'Sample']}
      rows={rows}
    />
  );
};

export const Gradients: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Gradients'
        description='Tailwind classes for controlling the gradient of an element.'
      />
      <StaticGradients />
      <h4 className='mt-32 mb-16 heading-5 text-base'>Asset Gradients</h4>
      <GradientTable />
    </div>
  ),
};
