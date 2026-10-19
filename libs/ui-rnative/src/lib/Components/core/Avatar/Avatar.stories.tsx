import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import { Box } from '../../primitives';
import { DotIndicator, getDotIndicatorProps } from '../DotIndicator';
import { Avatar } from './Avatar';
import { useResolveAvatarColor } from '.';

const meta = {
  component: Avatar,
  id: 'rnative-avatar',
  title: 'Core/Avatar',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

const exampleSrc =
  'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const getInitials = (index: number) => {
  const left = String.fromCharCode(65 + index * 2);
  const right = String.fromCharCode(66 + index * 2);
  return left + right;
};

export const Base: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  args: {
    src: exampleSrc,
    alt: 'avatar',
    size: 'md',
  },
  render: (args) => <Avatar {...args} />,
};

export const SizeShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <Box lx={{ gap: 's8' }}>
      <Box lx={{ alignItems: 'flex-end', flexDirection: 'row', gap: 's16' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
          <Avatar key={size} src={exampleSrc} alt={size} size={size} />
        ))}
      </Box>
      <Box lx={{ alignItems: 'flex-end', flexDirection: 'row', gap: 's16' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
          <Avatar key={size} alt={size} size={size} fallbackText='AB' />
        ))}
      </Box>
      <Box lx={{ alignItems: 'flex-end', flexDirection: 'row', gap: 's16' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
          <Avatar key={size} alt={size} size={size} />
        ))}
      </Box>
    </Box>
  ),
};

export const FallbackShowcase: Story = {
  render: () => {
    const fallbackColors = [
      useResolveAvatarColor('user-0'),
      useResolveAvatarColor('user-1'),
      useResolveAvatarColor('user-2'),
      useResolveAvatarColor('user-3'),
      useResolveAvatarColor('user-4'),
      useResolveAvatarColor('user-5'),
      useResolveAvatarColor('user-6'),
      useResolveAvatarColor('user-7'),
    ];

    return (
      <Box lx={{ gap: 's16' }}>
        <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's16' }}>
          {fallbackColors.map((fallbackColor, i) => (
            <Avatar
              key={i}
              fallbackColor={fallbackColor}
              fallbackText={getInitials(i)}
              alt={getInitials(i)}
            />
          ))}
          <Avatar fallbackText={getInitials(fallbackColors.length)} />
        </Box>
        <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's16' }}>
          {fallbackColors.map((fallbackColor, i) => (
            <Avatar key={i} fallbackColor={fallbackColor} alt={`User ${i}`} />
          ))}
          <Avatar />
        </Box>
      </Box>
    );
  },
};

export const AppearanceShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
      <Avatar size='md' alt='No ring' />
      <Avatar size='md' alt='Thin ring' appearance='thin' />
      <Avatar size='md' alt='Thick ring' appearance='thick' />
    </Box>
  ),
};

export const NotificationShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <Box lx={{ flexDirection: 'row', gap: 's16' }}>
      <Avatar src={exampleSrc} alt='avatar' size='md' />
      <DotIndicator {...getDotIndicatorProps('avatar', 'md')}>
        <Avatar src={exampleSrc} alt='avatar' size='md' />
      </DotIndicator>
    </Box>
  ),
};
