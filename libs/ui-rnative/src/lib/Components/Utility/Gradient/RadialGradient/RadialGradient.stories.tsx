import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../../Box';
import { Text } from '../../Text';
import { RadialGradient } from './RadialGradient';

const meta: Meta<typeof RadialGradient> = {
  component: RadialGradient,
  title: 'Utility/RadialGradient',
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
type Story = StoryObj<typeof RadialGradient>;

export const Base: Story = {
  args: {
    stops: [{ color: 'accent' }, { color: 'active', opacity: 0 }],
    lx: {
      height: 's192',
      width: 's192',
      borderRadius: 'lg',
    },
  },
};

export const CenterPositionShowcase: Story = {
  render: () => {
    const positions = [
      {
        title: 'Aspect ratio 1:1',
        isSquare: true,
        items: [
          {
            center: { x: 0.5, y: 0.5 },
            label: '{x: 0.5, y: 0.5} (default)',
          },
          { center: { x: 0.2, y: 0.2 }, label: '{x: 0.2, y: 0.2}' },
          { center: { x: 0.8, y: 0.8 }, label: '{x: 0.8, y: 0.8}' },
          { center: { x: 0.2, y: 0.8 }, label: '{x: 0.2, y: 0.8}' },
          { center: { x: 0.8, y: 0.2 }, label: '{x: 0.8, y: 0.2}' },
        ],
      },
      {
        title: 'Aspect ratio 1:2',
        isSquare: false,
        items: [
          {
            center: { x: 0.5, y: 0.5 },
            label: '{x: 0.5, y: 0.5} (default)',
          },
          { center: { x: 0.2, y: 0.2 }, label: '{x: 0.2, y: 0.2}' },
          { center: { x: 0.8, y: 0.8 }, label: '{x: 0.8, y: 0.8}' },
          { center: { x: 0.2, y: 0.8 }, label: '{x: 0.2, y: 0.8}' },
          { center: { x: 0.8, y: 0.2 }, label: '{x: 0.8, y: 0.2}' },
        ],
      },
    ];

    return (
      <Box lx={{ flexDirection: 'column', gap: 's40' }}>
        {positions.map(({ title, isSquare, items }) => (
          <Box key={title}>
            <Text
              typography='heading5SemiBold'
              lx={{ color: 'base', marginBottom: 's16' }}
            >
              {title}
            </Text>
            <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's24' }}>
              {items.map(({ center, label }) => (
                <Box key={label} lx={{ gap: 's8', alignItems: 'center' }}>
                  <RadialGradient
                    center={center}
                    stops={[
                      { color: 'accent' },
                      { color: 'active', opacity: 0 },
                    ]}
                    lx={{
                      height: 's72',
                      width: isSquare ? 's72' : 's144',
                      borderRadius: 'md',
                      borderColor: 'active',
                      borderWidth: 's1',
                    }}
                  />
                  <Text typography='body4' lx={{ color: 'base' }}>
                    {label}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  },
};

export const WithChildren: Story = {
  args: {
    stops: [{ color: 'accent' }, { color: 'active', opacity: 0 }],
    lx: {
      padding: 's24',
      borderRadius: 'lg',
      width: 's288',
      borderColor: 'active',
      borderWidth: 's1',
    },
  },
  render: (args) => (
    <RadialGradient {...args}>
      <Text typography='heading2SemiBold' lx={{ color: 'base' }}>
        With Children
      </Text>
      <Text typography='body2' lx={{ color: 'base', marginTop: 's8' }}>
        Adapt height based on content.
      </Text>
      <Text typography='body3' lx={{ color: 'base', marginTop: 's8' }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos
      </Text>
    </RadialGradient>
  ),
};

export const WithMultipleStops: Story = {
  args: {
    stops: [
      { color: 'warning', offset: 0, opacity: 1 },
      { color: 'accent', offset: 0.5, opacity: 1 },
      { color: 'error', offset: 1, opacity: 1 },
    ],
    lx: {
      height: 's80',
      width: 's80',
      borderRadius: 'full',
    },
  },
};
