import { AVATAR_COLOR_KEYS } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import { DotIndicator, getDotIndicatorProps } from '../DotIndicator';
import { Box } from '../Utility';
import { Avatar } from './Avatar';
import { resolveAvatarColor } from '.';

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
type Story = StoryObj<typeof meta>;

const exampleSrc =
  'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const getInitials = (index: number) => {
  const left = String.fromCharCode(65 + index * 2);
  const right = String.fromCharCode(66 + index * 2);
  return left + right;
};

export const Base: Story = {
  args: {
    src: exampleSrc,
    alt: 'avatar',
    size: 'md',
  },
  render: (args) => <Avatar {...args} />,
  parameters: {
    docs: {
      source: {
        code: `<Avatar src="https://example.com" size="md" alt="avatar" />`,
      },
    },
  },
};

export const SizeShowcase: Story = {
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
  parameters: {
    docs: {
      source: {
        code: `<Avatar fallbackColor={resolveAvatarColor(user.id)} alt={user.name} />`,
      },
    },
  },
  render: () => (
    <Box lx={{ gap: 's16' }}>
      <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's16' }}>
        {AVATAR_COLOR_KEYS.map((_, i) => (
          <Avatar
            key={i}
            fallbackColor={resolveAvatarColor(`user-${i}`)}
            fallbackText={getInitials(i)}
            alt={getInitials(i)}
          />
        ))}
        <Avatar fallbackText={getInitials(AVATAR_COLOR_KEYS.length)} />
      </Box>
      <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's16' }}>
        {AVATAR_COLOR_KEYS.map((_, i) => (
          <Avatar
            key={i}
            fallbackColor={resolveAvatarColor(`user-${i}`)}
            alt={`User ${i}`}
          />
        ))}
        <Avatar />
      </Box>
    </Box>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
      <Avatar size='md' alt='No ring' />
      <Avatar size='md' alt='Thin ring' appearance='thin' />
      <Avatar size='md' alt='Thick ring' appearance='thick' />
    </Box>
  ),
};

export const NotificationShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', gap: 's16' }}>
      <Avatar src={exampleSrc} alt='avatar' size='md' />
      <DotIndicator {...getDotIndicatorProps('avatar', 'md')}>
        <Avatar src={exampleSrc} alt='avatar' size='md' />
      </DotIndicator>
    </Box>
  ),
};
