import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import {
  CheckmarkCircleFill,
  DeleteCircleFill,
  Heart,
  InformationFill,
  Settings,
  Star,
  WarningFill,
} from '../../symbols';
import type { IconSize } from '../../symbols/Icon';
import { DotSymbol, getDotSymbolProps } from '../DotSymbol';
import { Spinner } from '../Spinner';
import { Spot } from './Spot';
import { SpotNumber } from './SpotNumber';
import type { SpotAppearance } from './types';

const meta = {
  component: Spot,
  id: 'react-spot',
  title: 'Core/Spot',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'dynamic',
      },
    },
  },
  argTypes: {
    icon: {
      control: 'select',
      options: ['Settings', 'Heart', 'Star', 'CheckmarkCircleFill'],
      mapping: {
        Settings: Settings,
        Heart: Heart,
        Star: Star,
        CheckmarkCircleFill: CheckmarkCircleFill,
      },
    },
  },
} satisfies Meta<typeof Spot>;

export default meta;
type Story = StoryObj<typeof Spot>;

export const Base: Story = {
  args: {
    icon: Settings,
  },
  render: (args) => <Spot {...args} />,
};

export const AppearanceShowcase: Story = {
  render: () => {
    const appearances: {
      name: string;
      appearance: SpotAppearance;
      icon: ComponentType<{ size?: IconSize; className?: string }>;
    }[] = [
      { name: 'Base', appearance: 'base', icon: Settings },
      { name: 'Success', appearance: 'success', icon: CheckmarkCircleFill },
      { name: 'Error', appearance: 'error', icon: DeleteCircleFill },
      { name: 'Warning', appearance: 'warning', icon: WarningFill },
      { name: 'Muted', appearance: 'muted', icon: InformationFill },
    ];

    return (
      <div className='flex flex-wrap gap-16 p-8 text-base'>
        {appearances.map(({ name, appearance, icon }) => (
          <div key={name} className='flex w-64 flex-col items-center gap-4'>
            <Spot appearance={appearance} icon={icon} />
            <span className='text-center text-muted'>{name}</span>
          </div>
        ))}
      </div>
    );
  },
};

export const FillShowcase: Story = {
  render: () => {
    const appearances: SpotAppearance[] = [
      'base',
      'success',
      'error',
      'warning',
      'muted',
      'decorative-blue',
      'decorative-pink',
      'decorative-purple',
      'decorative-green',
      'decorative-turquoise',
      'decorative-yellow',
      'decorative-orange',
      'decorative-red',
    ];

    return (
      <div className='flex flex-col gap-16 p-8'>
        {(['transparent', 'plain'] as const).map((fill) => (
          <div key={fill} className='flex flex-col gap-8'>
            <span className='body-2-semi-bold text-base'>{fill}</span>
            <div className='flex flex-wrap gap-12'>
              {appearances.map((appearance) => (
                <Spot
                  key={appearance}
                  appearance={appearance}
                  fill={fill}
                  icon={Settings}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const SizeShowcase: Story = {
  render: () => {
    const sizes = [32, 40, 48, 56, 72] as const;

    return (
      <div className='flex flex-col gap-32 p-16'>
        {sizes.map((size) => (
          <div key={size} className='flex flex-col gap-16'>
            <h3 className='body-2-semi-bold'>{size}px</h3>
            <div className='flex gap-12'>
              <Spot icon={Settings} size={size} />
              <Spot appearance='muted' icon={InformationFill} size={size} />
              <Spot
                appearance='success'
                fill='plain'
                icon={Settings}
                size={size}
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const WithSpinner: Story = {
  render: () => {
    const sizes = [32, 40, 48, 56, 72] as const;

    return (
      <div className='flex items-end gap-16 p-16'>
        {sizes.map((size) => (
          <Spot
            key={size}
            icon={Spinner}
            size={size}
            appearance='base'
            fill='plain'
          />
        ))}
      </div>
    );
  },
};

export const WithDotSymbol: Story = {
  render: () => {
    return (
      <div className='flex flex-col gap-32 p-16'>
        <DotSymbol
          src='https://crypto-icons.ledger.com/BTC.png'
          pin='bottom-end'
          {...getDotSymbolProps('spot', 48)}
        >
          <Spot icon={Settings} />
        </DotSymbol>
      </div>
    );
  },
};

export const WithNumber: Story = {
  render: () => {
    return (
      <div className='flex flex-col gap-32 p-16'>
        <SpotNumber value={9} />
      </div>
    );
  },
};
