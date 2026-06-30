import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Settings, Plus, ExternalLink } from '../../Symbols';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  id: 'react-button',
  title: 'Core/Button',
  parameters: {
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
      options: ['None', 'Plus', 'Settings'],
      mapping: {
        None: undefined,
        Plus: Plus,
        Settings: Settings,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;
type ButtonAppearance =
  | 'base'
  | 'gray'
  | 'accent'
  | 'transparent'
  | 'no-background'
  | 'red';

export const Base: Story = {
  args: {
    appearance: 'base',
    children: 'Base Button',
  },
};

export const IconText: Story = {
  args: {
    appearance: 'base',
    children: 'Add Item',
    icon: Plus,
  },
};

export const Loading: Story = {
  args: {
    appearance: 'base',
    children: 'Loading...',
    loading: true,
  },
};

export const AppearanceShowcase: Story = {
  tags: ['!dev'],
  parameters: {
    chromatic: { pauseAnimationAtEnd: true },
  },

  render: () => {
    const appearances: { name: string; appearance: ButtonAppearance }[] = [
      { name: 'Accent', appearance: 'accent' },
      { name: 'Base', appearance: 'base' },
      { name: 'Gray', appearance: 'gray' },
      { name: 'Transparent', appearance: 'transparent' },
      { name: 'No Background', appearance: 'no-background' },
      { name: 'Red', appearance: 'red' },
    ];

    return (
      <div className='flex gap-16 p-8'>
        {appearances.map(({ name, appearance }) => (
          <Button key={appearance} appearance={appearance}>
            {name}
          </Button>
        ))}
      </div>
    );
  },
};

export const ContentTypesShowcase: Story = {
  tags: ['!dev'],
  render: () => (
    <div className='flex items-center gap-4'>
      <Button appearance='base'>Text Only</Button>
      <Button appearance='base' icon={Plus}>
        With Icon
      </Button>
    </div>
  ),
};

export const SizesShowcase: Story = {
  tags: ['!dev'],
  render: () => {
    return (
      <div className='flex items-center gap-4'>
        <Button appearance='base' size='sm'>
          Small
        </Button>
        <Button appearance='base' size='md'>
          Medium
        </Button>
        <Button appearance='base' size='lg' icon={Settings}>
          Large
        </Button>
      </div>
    );
  },
};

export const StatesShowcase: Story = {
  parameters: {
    chromatic: { pauseAnimationAtEnd: true },
  },
  tags: ['!dev'],
  render: () => (
    <div className='flex items-center gap-4'>
      <Button appearance='base'>Default</Button>
      <Button appearance='base' disabled>
        Disabled
      </Button>
      <Button appearance='base' loading>
        Loading
      </Button>
      <Button appearance='base' disabled loading>
        Disabled Loading
      </Button>
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  tags: ['!dev'],
  render: () => (
    <div className='flex flex-col gap-8 p-8'>
      <Button appearance='base'>Short</Button>
      <Button appearance='base'>Medium length button</Button>
      <Button appearance='base' icon={Plus}>
        This is a longer button text to show dynamic width
      </Button>
    </div>
  ),
};

export const LabelTruncate: Story = {
  tags: ['!dev'],
  render: () => (
    <>
      <p className='body-4-semi-bold text-muted'>
        This container has a fixed width.
      </p>
      <div className='w-400 p-16'>
        <Button icon={Plus}>
          This Base button has a fixed width container that should fit the
          content width.
        </Button>
      </div>
    </>
  ),
};

export const InteractiveLoadingStates: Story = {
  tags: ['!dev'],
  render: () => {
    const [states, setStates] = useState<
      Record<'text' | 'withIcon', 'idle' | 'loading' | 'red'>
    >({
      text: 'idle',
      withIcon: 'idle',
    });

    const handleClick = async (key: keyof typeof states) => {
      setStates((prev) => ({ ...prev, [key]: 'loading' }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStates((prev) => ({ ...prev, [key]: 'red' }));
      setTimeout(() => setStates((prev) => ({ ...prev, [key]: 'idle' })), 2000);
    };

    return (
      <div className='flex items-center gap-4'>
        <Button
          appearance='red'
          loading={states.text === 'loading'}
          onClick={() => handleClick('text')}
        >
          {states.text === 'red' ? 'Error!' : 'Text Only'}
        </Button>

        <Button
          appearance='base'
          loading={states.withIcon === 'loading'}
          onClick={() => handleClick('withIcon')}
          icon={Settings}
        >
          {states.withIcon === 'red' ? 'Settings Error!' : 'With Icon'}
        </Button>
      </div>
    );
  },
};

export const AsChild: Story = {
  render: () => {
    // Mock Link component for demonstration
    const Link = ({
      to,
      children,
      ...props
    }: {
      to: string;
      children: React.ReactNode;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a href={to} {...props}>
        {children}
      </a>
    );

    return (
      <div className='flex flex-col gap-16 p-8'>
        <div className='flex gap-8'>
          <Button asChild appearance='base'>
            <Link to='#'>Open Button documentation</Link>
          </Button>

          <Button asChild appearance='accent' icon={ExternalLink}>
            <a
              href='https://shop.ledger.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              External Link to Ledger Shop
            </a>
          </Button>
        </div>
      </div>
    );
  },
};
