import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu, MenuTrigger, MenuContent, MenuItem } from '../Menu/Menu';
import { Avatar } from './Avatar';

const meta = {
  component: Avatar,
  title: 'Communication/Avatar',
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
    showNotification: false,
  },
  parameters: {
    docs: {
      source: {
        code: `<Avatar src="https://example.com" size="md" alt="Avatar" showNotification={false} />`,
      },
    },
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <div className='inline-flex items-stretch gap-16 body-2'>
      <div className='flex flex-col items-center justify-end'>
        <Avatar
          size='sm'
          alt='small'
          src={exampleSrc}
          showNotification={false}
        />
        <span className='mt-4'>sm</span>
      </div>
      <div className='flex flex-col items-center justify-end'>
        <Avatar
          size='md'
          alt='medium'
          src={exampleSrc}
          showNotification={false}
        />
        <span className='mt-4'>md</span>
      </div>
    </div>
  ),
};

export const FallbackShowcase: Story = {
  args: {
    src: 'https://brokenLink.random',
    size: 'md',
    alt: 'Fallback example',
    showNotification: false,
  },
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
    <div className='inline-flex items-center gap-16'>
      <Avatar src={exampleSrc} showNotification={false} />
      <Avatar src={exampleSrc} showNotification={true} />
    </div>
  ),
};

export const InteractiveShowcase: Story = {
  render: () => (
    <div className='inline-flex gap-24'>
      <Menu>
        <MenuTrigger asChild>
          <button className='cursor-pointer rounded-full transition-colors hover:bg-muted-hover'>
            <Avatar size='md' alt='Avatar as trigger' showNotification />
          </button>
        </MenuTrigger>
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
