import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Settings, Plus, Coins, CreditCard, Bank } from '../../Symbols';
import { Box, Text } from '../Utility';
import { CardButton } from './CardButton';

const meta: Meta<typeof CardButton> = {
  component: CardButton,
  title: 'Action/CardButton',
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
      options: ['base', 'outline'],
      description: 'The visual style appearance of the card button',
    },
    title: {
      control: 'text',
      description: 'The main title text for the card button',
    },
    description: {
      control: 'text',
      description: 'Optional description text displayed below the title',
    },
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
    hideChevron: {
      control: 'boolean',
      description: 'Whether to hide the chevron right icon on the right side',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the card button is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardButton>;
type CardButtonAppearance = 'base' | 'outline';

export const Base: Story = {
  args: {
    appearance: 'base',
    title: 'Basic Card Button',
  },
  render: (args) => <CardButton {...args} />,
  parameters: {
    docs: {
      source: {
        code: `
<CardButton
  appearance="base"
  title="Basic Card Button"
/>
`,
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    appearance: 'base',
    title: 'Settings',
    icon: Settings,
  },
  parameters: {
    docs: {
      source: {
        code: `
<CardButton
  appearance="base"
  title="Settings"
  icon={Settings}
/>
`,
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    appearance: 'base',
    title: 'Payment Method',
    description: 'Add or manage your payment options',
  },
  parameters: {
    docs: {
      source: {
        code: `
<CardButton
  appearance="base"
  title="Payment Method"
  description="Add or manage your payment options"
/>
`,
      },
    },
  },
};

export const WithoutChevron: Story = {
  args: {
    appearance: 'base',
    title: 'Navigate Forward',
    hideChevron: true,
  },
  parameters: {
    docs: {
      source: {
        code: `
<CardButton
  appearance="base"
  title="Navigate Forward"
  hideChevron
/>
`,
      },
    },
  },
};

export const FullFeatures: Story = {
  args: {
    appearance: 'base',
    title: 'Account Settings',
    description: 'Manage your account preferences and security',
    icon: Settings,
  },
  parameters: {
    docs: {
      source: {
        code: `
<CardButton
  appearance="base"
  title="Account Settings"
  description="Manage your account preferences and security"
  icon={Settings}
/>
`,
      },
    },
  },
};

export const NaturalWidth: Story = {
  render: () => (
    <Box lx={{ backgroundColor: 'mutedPressed', padding: 's16' }}>
      <Text
        typography='body4SemiBold'
        lx={{ color: 'muted', marginBottom: 's16' }}
      >
        CardButton naturally flows to fill parent container width
      </Text>
      <CardButton
        appearance='base'
        title='Natural Width Example'
        description='This card button demonstrates how it flows naturally to fill the full width of its parent container without any max-width constraints'
        icon={CreditCard}
      />
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<CardButton
  appearance="base"
  title="Natural Width Example"
  description="This card button demonstrates how it flows naturally to fill the full width of its parent container without any max-width constraints"
  icon={CreditCard}
/>
`,
      },
    },
  },
};

export const AppearanceShowcase: Story = {
  render: () => {
    const appearances: {
      name: string;
      appearance: CardButtonAppearance;
    }[] = [
      { name: 'Base', appearance: 'base' },
      { name: 'Outline', appearance: 'outline' },
    ];

    return (
      <Box
        lx={{
          flexDirection: 'column',
          gap: 's16',
          padding: 's8',
          maxWidth: 's400',
        }}
      >
        {appearances.map(({ name, appearance }) => (
          <CardButton
            key={appearance}
            appearance={appearance}
            title={`${name} Appearance`}
            description='This demonstrates the appearance variation'
            icon={Coins}
          />
        ))}
      </Box>
    );
  },
};

export const ContentVariations: Story = {
  render: () => (
    <Box
      lx={{
        flexDirection: 'column',
        gap: 's16',
        padding: 's8',
        maxWidth: 's400',
      }}
    >
      <CardButton
        appearance='base'
        title='With Description'
        description='This card has a description below the title'
        hideChevron
      />
      <CardButton
        appearance='base'
        title='Icon and Description'
        description='This card has both an icon and description'
        icon={Settings}
        hideChevron
      />
      <CardButton
        appearance='base'
        title='Description and Chevron'
        description='This card has description and chevron'
      />
      <CardButton
        appearance='base'
        title='Complete Card'
        description='This card has all optional features'
        icon={CreditCard}
      />
      <CardButton appearance='base' title='With Icon' icon={Plus} hideChevron />
      <CardButton appearance='base' title='With Chevron' />
    </Box>
  ),
};

export const StatesShowcase: Story = {
  render: () => (
    <Box
      lx={{
        flexDirection: 'column',
        gap: 's16',
        padding: 's8',
        maxWidth: 's400',
      }}
    >
      <CardButton
        appearance='base'
        title='Base Default'
        description='This is the normal interactive state'
        icon={Settings}
      />
      <CardButton
        appearance='base'
        title='Base Disabled'
        description='This card button is disabled'
        icon={Settings}
        disabled
      />
      <CardButton
        appearance='outline'
        title='Outline Default'
        description='This is the outline appearance'
        icon={Bank}
      />
      <CardButton
        appearance='outline'
        title='Outline Disabled'
        description='This is the disabled outline appearance'
        icon={Bank}
        disabled
      />
    </Box>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box
      lx={{
        width: 's320',
        flexDirection: 'column',
        gap: 's16',
        backgroundColor: 'mutedPressed',
        padding: 's16',
      }}
    >
      <Text typography='body4SemiBold' lx={{ color: 'muted' }}>
        Container: 320px wide
      </Text>
      <CardButton
        appearance='base'
        title='Short Title'
        description='Short description'
        icon={Plus}
      />
      <CardButton
        appearance='base'
        title='Full Width'
        description='Short description'
        icon={Plus}
      />
      <CardButton
        appearance='base'
        title='Longer Title That Might Overflow When Container is Smaller'
        description='This is a longer description that demonstrates how the card handles longer content within its constraints'
        icon={Settings}
      />
    </Box>
  ),
};
