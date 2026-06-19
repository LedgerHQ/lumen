import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../Utility/Box';
import { Text } from '../Utility/Text';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  component: Divider,
  title: 'Core/Divider',
  parameters: {
    actions: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Base: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => {
    const isVertical = args.orientation === 'vertical';
    return (
      <Box
        lx={
          isVertical
            ? { flexDirection: 'row', alignItems: 'center', gap: 's16' }
            : { width: 'full', gap: 's16' }
        }
      >
        <Text typography='body2' lx={{ color: 'base' }}>
          {isVertical ? 'Left content' : 'Content above'}
        </Text>
        <Divider {...args} lx={isVertical ? { height: 's48' } : undefined} />
        <Text typography='body2' lx={{ color: 'base' }}>
          {isVertical ? 'Right content' : 'Content below'}
        </Text>
      </Box>
    );
  },
};

export const OrientationShowcase: Story = {
  render: () => (
    <Box lx={{ gap: 's32' }}>
      <Box lx={{ gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Horizontal (default)
        </Text>
        <Box lx={{ width: 'full', gap: 's16' }}>
          <Text typography='body2' lx={{ color: 'base' }}>
            Content above
          </Text>
          <Divider orientation='horizontal' />
          <Text typography='body2' lx={{ color: 'base' }}>
            Content below
          </Text>
        </Box>
      </Box>

      <Box lx={{ gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Vertical
        </Text>
        <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
          <Text typography='body2' lx={{ color: 'base' }}>
            Left content
          </Text>
          <Divider orientation='vertical' lx={{ height: 's48' }} />
          <Text typography='body2' lx={{ color: 'base' }}>
            Right content
          </Text>
        </Box>
      </Box>
    </Box>
  ),
};

export const InList: Story = {
  render: () => (
    <Box
      lx={{
        width: 'full',
        maxWidth: 's400',
        backgroundColor: 'canvas',
        borderRadius: 'lg',
        borderWidth: 's1',
        borderColor: 'muted',
      }}
    >
      <Box
        lx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 's16',
        }}
      >
        <Text typography='body2' lx={{ color: 'base' }}>
          Item 1
        </Text>
        <Text typography='body3' lx={{ color: 'muted' }}>
          $100
        </Text>
      </Box>
      <Divider />
      <Box
        lx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 's16',
        }}
      >
        <Text typography='body2' lx={{ color: 'base' }}>
          Item 2
        </Text>
        <Text typography='body3' lx={{ color: 'muted' }}>
          $200
        </Text>
      </Box>
      <Divider />
      <Box
        lx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 's16',
        }}
      >
        <Text typography='body2' lx={{ color: 'base' }}>
          Item 3
        </Text>
        <Text typography='body3' lx={{ color: 'muted' }}>
          $300
        </Text>
      </Box>
    </Box>
  ),
};
