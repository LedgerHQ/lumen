import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Settings, Plus, Heart, Star } from '../../Symbols';
import { IconSize } from '../Icon';
import { Spot } from './Spot';
import { SpotAppearance } from './types';

const meta: Meta<typeof Spot> = {
  component: Spot,
  title: 'Communication/Spot',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    icon: {
      control: 'select',
      options: ['None', 'Settings', 'Plus', 'Heart', 'Star'],
      mapping: {
        None: undefined,
        Settings: Settings,
        Plus: Plus,
        Heart: Heart,
        Star: Star,
      },
    },
    number: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spot>;

export const Base: Story = {
  args: {
    appearance: 'icon',
    icon: Settings,
  },
  parameters: {
    docs: {
      source: {
        code: `
<Spot
  appearance="icon"
  icon={Settings}
/>
`,
      },
    },
  },
};

export const AppearanceShowcase: Story = {
  render: () => {
    const appearances: Array<{
      name: string;
      appearance: SpotAppearance;
      icon?: React.ComponentType<{ size?: IconSize; className?: string }>;
      number?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    }> = [
      { name: 'Icon', appearance: 'icon', icon: Settings },
      { name: 'Bluetooth', appearance: 'bluetooth' },
      { name: 'Check', appearance: 'check' },
      { name: 'Error', appearance: 'error' },
      { name: 'Warning', appearance: 'warning' },
      { name: 'Info', appearance: 'info' },
      { name: 'Loader', appearance: 'loader' },
      { name: 'Number', appearance: 'number', number: 3 },
    ];

    return (
      <div className='flex flex-wrap gap-16 p-8 text-base'>
        {appearances.map(({ name, appearance, icon, number }) => (
          <div
            key={appearance}
            className='flex w-64 flex-col items-center gap-4'
          >
            <Spot
              appearance={appearance as any}
              icon={icon}
              number={number as any}
            />
            <span className='text-center text-muted'>{name}</span>
          </div>
        ))}
      </div>
    );
  },
};

export const IconVariants: Story = {
  render: () => {
    const icons = [
      { name: 'Settings', component: Settings },
      { name: 'Plus', component: Plus },
      { name: 'Heart', component: Heart },
      { name: 'Star', component: Star },
    ];

    return (
      <div className='flex gap-8 p-8'>
        {icons.map(({ name, component: Icon }) => (
          <Spot key={name} appearance='icon' icon={Icon} />
        ))}
      </div>
    );
  },
};

export const NumberVariants: Story = {
  render: () => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

    return (
      <div className='flex flex-wrap gap-8 p-8'>
        {numbers.map((num) => (
          <Spot key={num} appearance='number' number={num} />
        ))}
      </div>
    );
  },
};

export const SizesShowcase: Story = {
  render: () => {
    const sizes = [32, 40, 48, 56, 72] as const;

    return (
      <div className='flex flex-col gap-32 p-16'>
        {sizes.map((size) => (
          <div key={size} className='flex flex-col gap-16'>
            <h3 className='heading-5-semi-bold'>{size}px</h3>
            <div className='flex gap-12'>
              <Spot appearance='icon' icon={Settings} size={size} />
              <Spot appearance='info' size={size} />
              <Spot appearance='number' number={5} size={size} />
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const StatesShowcase: Story = {
  render: () => {
    return (
      <div className='flex flex-col gap-16 text-base'>
        <div className='flex flex-col gap-8'>
          <div>Default</div>
          <div className='flex flex-wrap gap-16'>
            <div className='flex w-64 flex-col items-center gap-4'>
              <Spot appearance='icon' icon={Settings} />
            </div>
            <div className='flex w-64 flex-col items-center gap-4'>
              <Spot appearance='bluetooth' />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-8'>
          <div>Disabled</div>
          <div className='flex flex-wrap gap-16'>
            <div className='flex w-64 flex-col items-center gap-4'>
              <Spot appearance='icon' icon={Settings} disabled />
            </div>
            <div className='flex w-64 flex-col items-center gap-4'>
              <Spot appearance='bluetooth' disabled />
            </div>
          </div>
        </div>
      </div>
    );
  },
};
