import {
  AVATAR_COLORS,
  resolveAvatarColor,
} from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DotIndicator, getDotIndicatorProps } from '../DotIndicator';
import { Menu, MenuTrigger, MenuContent, MenuItem } from '../Menu/Menu';
import { Avatar } from './Avatar';

const meta = {
  component: Avatar,
  id: 'react-avatar',
  title: 'Core/Avatar',
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
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const exampleSrc =
  'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const Base: Story = {
  args: {
    src: exampleSrc,
    size: 'md',
    alt: 'Avatar',
  },
  parameters: {
    docs: {
      source: {
        code: `<Avatar src="https://example.com" size="md" alt="Avatar" />`,
      },
    },
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <div className='inline-flex items-stretch gap-16 body-2'>
      <div className='flex flex-col items-center justify-end'>
        <Avatar size='sm' alt='small' src={exampleSrc} />
        <span className='mt-4'>sm</span>
      </div>
      <div className='flex flex-col items-center justify-end'>
        <Avatar size='md' alt='medium' src={exampleSrc} />
        <span className='mt-4'>md</span>
      </div>
      <div className='flex flex-col items-center justify-end'>
        <Avatar size='lg' alt='large' src={exampleSrc} />
        <span className='mt-4'>lg</span>
      </div>
      <div className='flex flex-col items-center justify-end'>
        <Avatar size='xl' alt='extra large' src={exampleSrc} />
        <span className='mt-4'>xl</span>
      </div>
    </div>
  ),
};

export const FallbackShowcase: Story = {
  parameters: {
    docs: {
      source: {
        code: `import { resolveAvatarColor } from '@ledgerhq/lumen-utils-shared';

<Avatar fallbackColor={resolveAvatarColor(user.id)} alt={user.name} />`,
      },
    },
  },
  render: () => {
    const getInitials = (index: number) => {
      const left = String.fromCharCode(65 + index * 2);
      const right = String.fromCharCode(66 + index * 2);
      return left + right;
    };

    return (
      <div className='flex flex-col gap-16'>
        <div className='flex flex-wrap gap-16'>
          {AVATAR_COLORS.map((_, i) => (
            <Avatar
              key={i}
              fallbackColor={resolveAvatarColor(`user-${i}`)}
              fallbackText={getInitials(i)}
              alt={getInitials(i)}
            />
          ))}
          <Avatar fallbackText={getInitials(AVATAR_COLORS.length)} />
        </div>
        <div className='flex flex-wrap gap-16'>
          {AVATAR_COLORS.map((_, i) => (
            <Avatar
              key={i}
              fallbackColor={resolveAvatarColor(`user-${i}`)}
              alt={`User ${i}`}
            />
          ))}
          <Avatar />
        </div>
      </div>
    );
  },
};

export const NotificationShowcase: Story = {
  render: () => (
    <div className='inline-flex items-center gap-16'>
      <Avatar src={exampleSrc} />
      <DotIndicator {...getDotIndicatorProps('avatar', 'md')}>
        <Avatar src={exampleSrc} />
      </DotIndicator>
    </div>
  ),
};

export const InteractiveShowcase: Story = {
  render: () => (
    <div className='inline-flex gap-24'>
      <Menu>
        <MenuTrigger
          render={
            <button
              type='button'
              className='cursor-pointer rounded-full transition-colors hover:bg-muted-hover'
            >
              <DotIndicator {...getDotIndicatorProps('avatar', 'md')}>
                <Avatar size='md' alt='Avatar as trigger' />
              </DotIndicator>
            </button>
          }
        />
        <MenuContent className='w-208'>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Notifications</MenuItem>
          <MenuItem>Team</MenuItem>
          <MenuItem>Subscription</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <a
          href='https://shop.ledger.com/pages/ledger-nano-gen5'
          className='rounded-full transition-colors hover:bg-muted-hover'
          target='_blank'
          rel='noreferrer'
        >
          <Avatar size='md' />
        </a>
      </Menu>
    </div>
  ),
};
