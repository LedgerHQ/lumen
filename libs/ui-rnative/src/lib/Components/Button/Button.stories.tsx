import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React from 'react';
import { Plus, Settings } from '../../Symbols';
import { Box, Text } from '../Utility';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Action/Button',
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
      icon: {
        control: 'select',
        description: 'Optional icon component to display',
        options: ['None', 'Plus', 'Settings'],
        mapping: {
          None: undefined,
          Plus: Plus,
          Settings: Settings,
        },
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
  render: (args) => <Button {...args} />,
  parameters: {
    docs: {
      source: {
        code: `
<Button appearance="base">
  Base Button
</Button>
`,
      },
    },
  },
};

export const IconText: Story = {
  args: {
    appearance: 'base',
    children: 'Add Item',
    icon: Plus,
  },
  parameters: {
    docs: {
      source: {
        code: `
<Button
  appearance="base"
  icon={Plus}
>
  Add Item
</Button>
`,
      },
    },
  },
};

export const Loading: Story = {
  args: {
    appearance: 'base',
    children: 'Loading...',
    loading: true,
  },
  parameters: {
    docs: {
      source: {
        code: `
<Button
  appearance="base"
  loading
>
  Loading...
</Button>
`,
      },
    },
  },
};

export const AppearanceShowcase: Story = {
  render: () => {
    const appearances: Array<{ name: string; appearance: ButtonAppearance }> = [
      { name: 'Accent', appearance: 'accent' },
      { name: 'Base', appearance: 'base' },
      { name: 'Gray', appearance: 'gray' },
      { name: 'Transparent', appearance: 'transparent' },
      { name: 'No Background', appearance: 'no-background' },
      { name: 'Red', appearance: 'red' },
    ];

    return (
      <Box lx={{ flexDirection: 'row', gap: 's16', padding: 's8' }}>
        {appearances.map(({ name, appearance }) => (
          <Button key={appearance} appearance={appearance}>
            {name}
          </Button>
        ))}
      </Box>
    );
  },
};

export const ContentTypesShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's4' }}>
      <Button appearance='base'>Text Only</Button>
      <Button appearance='base' icon={Plus}>
        With Icon
      </Button>
    </Box>
  ),
};

export const SizesShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's4' }}>
      <Button appearance='base' size='sm'>
        Small
      </Button>
      <Button appearance='base' size='md'>
        Medium
      </Button>
      <Button appearance='base' size='lg' icon={Settings}>
        Large
      </Button>
    </Box>
  ),
};

export const StatesShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's4' }}>
      <Button appearance='base'>Default</Button>
      <Button appearance='base' disabled>
        Disabled
      </Button>
      <Button appearance='base' loading>
        Loading
      </Button>
      <Button appearance='base' loading disabled>
        Loading
      </Button>
    </Box>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box
      lx={{
        flexDirection: 'column',
        gap: 's8',
        padding: 's8',
        alignItems: 'flex-start',
      }}
    >
      <Button appearance='base'>Short</Button>
      <Button appearance='base'>Medium length button</Button>
      <Button appearance='base' icon={Plus}>
        This is a longer button text to show dynamic width
      </Button>
    </Box>
  ),
};

export const LabelTruncate: Story = {
  render: () => (
    <Box>
      <Text typography='body4SemiBold' lx={{ color: 'muted' }}>
        This container has a fixed width.
      </Text>
      <Box lx={{ width: 's400', padding: 's16' }}>
        <Button icon={Plus}>
          This Base button has a fixed width container that should fit the
          content width.
        </Button>
      </Box>
    </Box>
  ),
};

export const InteractiveLoadingStates: Story = {
  render: () => {
    const [states, setStates] = React.useState<
      Record<'text' | 'withIcon' | 'iconOnly', 'idle' | 'loading' | 'red'>
    >({
      text: 'idle',
      withIcon: 'idle',
      iconOnly: 'idle',
    });

    const handleClick = async (key: keyof typeof states) => {
      setStates((prev) => ({ ...prev, [key]: 'loading' }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStates((prev) => ({ ...prev, [key]: 'red' }));
      setTimeout(() => setStates((prev) => ({ ...prev, [key]: 'idle' })), 2000);
    };

    return (
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's4' }}>
        <Button
          appearance='red'
          loading={states.text === 'loading'}
          onPress={() => handleClick('text')}
        >
          {states.text === 'red' ? 'Error!' : 'Text Only'}
        </Button>

        <Button
          appearance='base'
          loading={states.withIcon === 'loading'}
          onPress={() => handleClick('withIcon')}
          icon={Settings}
        >
          {states.withIcon === 'red' ? 'Settings Error!' : 'With Icon'}
        </Button>
      </Box>
    );
  },
};
