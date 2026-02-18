import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useTheme } from 'src/styles';
import { Box } from '../../Box';
import { Text } from '../../Text';
import { LinearGradient } from './LinearGradient';

const meta: Meta<typeof LinearGradient> = {
  component: LinearGradient,
  title: 'Utility/LinearGradient',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LinearGradient>;

export const Base: Story = {
  args: {
    direction: 'to-bottom',
    stops: [{ color: 'accent' }, { color: 'active', opacity: 0 }],
    lx: {
      width: 's192',
      height: 's56',
      borderRadius: 'lg',
    },
  },
};

export const DirectionShowcase: Story = {
  render: () => {
    const orientations = [
      'to-bottom',
      'to-right',
      'to-top',
      'to-left',
      'to-bottomright',
      'to-bottomleft',
      'to-topright',
      'to-topleft',
      0,
      90,
      180,
      270,
    ] as const;

    return (
      <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's20' }}>
        {orientations.map((orientation) => {
          return (
            <Box key={orientation} lx={{ gap: 's4' }}>
              <LinearGradient
                direction={orientation}
                stops={[{ color: 'accent' }, { color: 'active', opacity: 0 }]}
                lx={{ height: 's40', width: 's176', borderRadius: 'md' }}
              />
              <Text typography='body4' lx={{ color: 'base' }}>
                {orientation}
              </Text>
            </Box>
          );
        })}
      </Box>
    );
  },
};

export const WithChildren: Story = {
  args: {
    direction: 'to-bottomright',
    stops: [{ color: 'accent' }, { color: 'active', opacity: 0, offset: 0.75 }],
    lx: {
      padding: 's24',
      borderRadius: 'lg',
      width: 's288',
    },
  },
  render: (args) => (
    <LinearGradient {...args}>
      <Text typography='heading2SemiBold' lx={{ color: 'base' }}>
        With Children
      </Text>
      <Text typography='body2' lx={{ color: 'base', marginTop: 's8' }}>
        Adapt height based on content.
      </Text>
      <Text typography='body3' lx={{ color: 'base', marginTop: 's8' }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit consectetur
        adipisicing elit adipisicing elit. Mas adename labin anet.
      </Text>
    </LinearGradient>
  ),
};

export const WithMultipleStops: Story = {
  args: {
    direction: 'to-right',
    stops: [
      { color: 'accent', offset: 0, opacity: 1 },
      { color: 'warning', offset: 0.5, opacity: 1 },
      { color: 'errorStrong', offset: 1, opacity: 1 },
    ],
    lx: {
      borderRadius: 'md',
      height: 's56',
      width: 's288',
    },
  },
  render: (args) => {
    return (
      <Box lx={{ gap: 's12' }}>
        <LinearGradient {...args} />
        <Box lx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>accent</Text>
          <Text>warning</Text>
          <Text>errorStrong</Text>
        </Box>
      </Box>
    );
  },
};

export const CryptoGradients: Story = {
  args: {
    direction: 'to-bottomright',
    lx: {
      borderRadius: 'md',
      height: 's56',
      width: 's288',
    },
  },
  render: (args) => {
    const { theme } = useTheme();

    return (
      <Box
        lx={{
          gap: 's20',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {Object.entries(theme.colors.gradients.crypto).map(
          ([key, gradient]) => (
            <Box key={key} lx={{ gap: 's4' }}>
              <LinearGradient
                {...args}
                lx={{
                  height: 's40',
                  width: 's176',
                  borderRadius: 'md',
                }}
                stops={gradient}
              ></LinearGradient>
              <Text typography='body4' lx={{ color: 'base' }}>
                {key}
              </Text>
            </Box>
          ),
        )}
      </Box>
    );
  },
};
