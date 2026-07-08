import type { Meta, StoryObj } from '@storybook/react-vite';
import { stripSizePrefix } from '../formatToken';
import { SectionHeader } from '../shared';
import { DimensionTable } from './dimensionTable';

const meta: Meta = {
  id: 'react-spacing',
  title: 'Foundations/Spacing',
};

export default meta;
type Story = StoryObj;

export const Spacing: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Spacing'
        description='Tailwind classes for controlling the spacing of an element. Includes padding, margin, and gap.'
      />
      <DimensionTable
        select={(theme) => theme.spacings}
        cssToken={(key) => `--spacing-${stripSizePrefix(key)}`}
        utility={(key) => `p-${stripSizePrefix(key)}`}
        renderSample={(value, accentColor) => (
          <div
            style={{
              width: value,
              height: 16,
              backgroundColor: accentColor,
              borderRadius: 2,
            }}
          />
        )}
      />
    </div>
  ),
};
