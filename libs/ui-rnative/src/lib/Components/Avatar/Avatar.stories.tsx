import { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text, Pressable, Linking } from 'react-native';

import { Box } from '../Utility';
import { Avatar } from './Avatar';

const meta = {
  component: Avatar,
  title: 'Communication/Avatar',
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

export const Base: Story = {
  args: {
    src: exampleSrc,
    alt: 'avatar',
    size: 'md',
    showNotification: false,
  },
  render: (args) => <Avatar {...args} />,
  parameters: {
    docs: {
      source: {
        code: `<Avatar src="https://example.com" size="md" alt="avatar" showNotification={false} />`,
      },
    },
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <Box
      lx={{
        alignItems: 'stretch',
        flexDirection: 'row',
        gap: 's16',
      }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
        <Avatar
          src={exampleSrc}
          alt='avatar'
          size='sm'
          showNotification={false}
        />
        <Text style={{ marginTop: 4 }}>sm</Text>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
        <Avatar
          src={exampleSrc}
          alt='avatar'
          size='md'
          showNotification={false}
        />
        <Text style={{ marginTop: 4 }}>md</Text>
      </View>
    </Box>
  ),
};

export const FallbackShowcase: Story = {
  args: {
    src: 'https://brokenLink.random',
    size: 'md',
    alt: 'Fallback example',
    showNotification: false,
  },
  render: (args) => <Avatar {...args} />,
  parameters: {
    docs: {
      source: {
        code: `<Avatar src="https://brokenLink.random" size="md" alt="Fallback example" showNotification={false} />`,
      },
    },
  },
};

export const NotificationShowcase: Story = {
  render: () => (
    <Box
      lx={{
        flexDirection: 'row',
        gap: 's16',
      }}
    >
      <Avatar
        src={exampleSrc}
        alt='avatar'
        size='md'
        showNotification={false}
      />
      <Avatar src={exampleSrc} alt='avatar' size='md' showNotification={true} />
    </Box>
  ),
};

const onPressRedirect = () =>
  Linking.openURL('https://shop.ledger.com/pages/ledger-nano-gen5');

export const InteractiveShowcase: Story = {
  render: () => (
    <Pressable
      onPress={onPressRedirect}
      style={({ pressed }) => ({
        borderRadius: 9999,
        opacity: pressed ? 0.7 : 1,
        backgroundColor: pressed ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
      })}
    >
      <Avatar src={exampleSrc} size='md' showNotification />
    </Pressable>
  ),
};
