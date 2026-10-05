import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import type { ComponentType } from 'react';
import { Box, Text } from '../../primitives';
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
import type { SpotAppearance } from './types';

const meta = {
  component: Spot,
  id: 'rnative-spot',
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
      icon: ComponentType<{ size?: IconSize }>;
    }[] = [
      { name: 'Base', appearance: 'base', icon: Settings },
      { name: 'Success', appearance: 'success', icon: CheckmarkCircleFill },
      { name: 'Error', appearance: 'error', icon: DeleteCircleFill },
      { name: 'Warning', appearance: 'warning', icon: WarningFill },
      { name: 'Muted', appearance: 'muted', icon: InformationFill },
    ];

    return (
      <Box
        lx={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 's16',
          padding: 's8',
        }}
      >
        {appearances.map(({ name, appearance, icon }) => (
          <Box
            key={name}
            lx={{ alignItems: 'center', gap: 's4', width: 's64' }}
          >
            <Spot appearance={appearance} icon={icon} />
            <Text
              typography='body3'
              lx={{ color: 'muted', textAlign: 'center' }}
            >
              {name}
            </Text>
          </Box>
        ))}
      </Box>
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
      <Box lx={{ gap: 's16', padding: 's8' }}>
        {(['transparent', 'plain'] as const).map((fill) => (
          <Box key={fill} lx={{ gap: 's8' }}>
            <Text typography='body2SemiBold' lx={{ color: 'base' }}>
              {fill}
            </Text>
            <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's12' }}>
              {appearances.map((appearance) => (
                <Spot
                  key={appearance}
                  appearance={appearance}
                  fill={fill}
                  icon={Settings}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  },
};

export const SizeShowcase: Story = {
  render: () => {
    const sizes = [32, 40, 48, 56, 72] as const;

    return (
      <Box lx={{ gap: 's32', padding: 's16' }}>
        {sizes.map((size) => (
          <Box key={size} lx={{ gap: 's16' }}>
            <Text typography='body2SemiBold'>{size}px</Text>
            <Box
              lx={{ flexDirection: 'row', gap: 's12', alignItems: 'center' }}
            >
              <Spot icon={Settings} size={size} />
              <Spot appearance='muted' icon={InformationFill} size={size} />
              <Spot
                appearance='success'
                fill='plain'
                icon={Settings}
                size={size}
              />
            </Box>
          </Box>
        ))}
      </Box>
    );
  },
};

export const WithSpinner: Story = {
  render: () => {
    const sizes = [32, 40, 48, 56, 72] as const;

    return (
      <Box
        lx={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 's16',
          padding: 's16',
        }}
      >
        {sizes.map((size) => (
          <Spot key={size} icon={Spinner} size={size} />
        ))}
      </Box>
    );
  },
};

export const WithDotSymbol: Story = {
  render: () => {
    return (
      <Box lx={{ padding: 's16' }}>
        <DotSymbol
          src='https://crypto-icons.ledger.com/BTC.png'
          pin='bottom-end'
          {...getDotSymbolProps('spot', 48)}
        >
          <Spot icon={Settings} />
        </DotSymbol>
      </Box>
    );
  },
};
