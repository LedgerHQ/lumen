import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React from 'react';
import { Settings, Plus, Heart, Star } from '../../Symbols';
import { IconProps } from '../Icon';
import { Box, Text } from '../Utility';
import { Spot } from './Spot';
import { SpotProps } from './types';

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
    appearance: {
      control: 'select',
      options: [
        'icon',
        'bluetooth',
        'check',
        'error',
        'warning',
        'info',
        'loader',
        'number',
      ],
      description: 'The visual appearance and behavior of the spot',
    },
    size: {
      control: 'select',
      options: [32, 40, 48, 56, 72],
      description: 'The size of the spot',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the spot looks disabled',
    },
    icon: {
      control: 'select',
      description: 'Icon component to display (required for icon appearance)',
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
      description: 'Number to display (required for number appearance)',
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
      appearance: SpotProps['appearance'];
      icon?: React.ComponentType<IconProps>;
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
      <Box
        lx={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 's16',
          padding: 's8',
        }}
      >
        {appearances.map(({ name, appearance, icon, number }) => (
          <Box
            key={appearance}
            lx={{
              width: 's64',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 's4',
            }}
          >
            <Spot
              appearance={appearance as any}
              icon={icon}
              number={number as any}
            />
            <Text typography='body3' lx={{ color: 'muted' }}>
              {name}
            </Text>
          </Box>
        ))}
      </Box>
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
      <Box lx={{ flexDirection: 'row', gap: 's8', padding: 's8' }}>
        {icons.map(({ name, component: Icon }) => (
          <Spot key={name} appearance='icon' icon={Icon} />
        ))}
      </Box>
    );
  },
};

export const NumberVariants: Story = {
  render: () => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

    return (
      <Box
        lx={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 's8',
          padding: 's8',
        }}
      >
        {numbers.map((num) => (
          <Spot key={num} appearance='number' number={num} />
        ))}
      </Box>
    );
  },
};

export const SizesShowcase: Story = {
  render: () => {
    const sizes = [32, 40, 48, 56, 72] as const;

    return (
      <Box lx={{ flexDirection: 'column', gap: 's32', padding: 's16' }}>
        {sizes.map((size) => (
          <Box key={size} lx={{ flexDirection: 'column', gap: 's16' }}>
            <Text typography='heading5SemiBold'>{size}px</Text>
            <Box lx={{ flexDirection: 'row', gap: 's12' }}>
              <Spot appearance='icon' icon={Settings} size={size} />
              <Spot appearance='info' size={size} />
              <Spot appearance='number' number={5} size={size} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  },
};

export const StatesShowcase: Story = {
  render: () => {
    return (
      <Box lx={{ flexDirection: 'column', gap: 's16' }}>
        <Box lx={{ flexDirection: 'column', gap: 's8' }}>
          <Text typography='body2'>Default</Text>
          <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's16' }}>
            <Box
              lx={{
                width: 's64',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 's4',
              }}
            >
              <Spot appearance='icon' icon={Settings} />
            </Box>
            <Box
              lx={{
                width: 's64',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 's4',
              }}
            >
              <Spot appearance='bluetooth' />
            </Box>
          </Box>
        </Box>
        <Box lx={{ flexDirection: 'column', gap: 's8' }}>
          <Text typography='body2'>Disabled</Text>
          <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's16' }}>
            <Box
              lx={{
                width: 's64',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 's4',
              }}
            >
              <Spot appearance='icon' icon={Settings} disabled />
            </Box>
            <Box
              lx={{
                width: 's64',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 's4',
              }}
            >
              <Spot appearance='bluetooth' disabled />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
};
