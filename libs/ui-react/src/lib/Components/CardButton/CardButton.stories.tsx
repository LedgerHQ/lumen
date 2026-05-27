import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings, Plus, Coins, CreditCard, Bank } from '../../Symbols';
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
type Story = StoryObj<typeof CardButton>;
type CardButtonAppearance = 'base' | 'outline';

export const Base: Story = {
  args: {
    appearance: 'base',
    title: 'Basic Card Button',
  },
  parameters: {
    docs: {
      source: {
        code: `
<CardButton
  appearance="base"
  title="Basic Card Button"
  className="max-w-md"
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
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      source: {
        code: `
<CardButton
  appearance="base"
  title="Settings"
  icon={Settings}
  className="max-w-md"
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
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      source: {
        code: `
<CardButton
  appearance="base"
  title="Payment Method"
  description="Add or manage your payment options"
  className="max-w-md"
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
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      source: {
        code: `
<CardButton
  appearance="base"
  title="Navigate Forward"
  hideChevron
  className="max-w-md"
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
    className: 'max-w-md',
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
  className="max-w-md"
/>
`,
      },
    },
  },
};

export const NaturalWidth: Story = {
  render: () => (
    <div className='w-full bg-muted-pressed p-16'>
      <div className='mb-16 body-4-semi-bold text-muted'>
        CardButton naturally flows to fill parent container width
      </div>
      <CardButton
        appearance='base'
        title='Natural Width Example'
        description='This card button demonstrates how it flows naturally to fill the full width of its parent container without any max-width constraints'
        icon={CreditCard}
      />
    </div>
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
      <div className='flex max-w-md flex-col gap-16 p-8'>
        {appearances.map(({ name, appearance }) => (
          <CardButton
            key={appearance}
            appearance={appearance}
            title={`${name} Appearance`}
            description='This demonstrates the appearance variation'
            icon={Coins}
          />
        ))}
      </div>
    );
  },
};

export const ContentVariations: Story = {
  render: () => (
    <div className='flex max-w-md flex-col gap-16 p-8'>
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
    </div>
  ),
};

export const StatesShowcase: Story = {
  render: () => (
    <div className='flex max-w-md flex-col gap-16 p-8'>
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
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <div className='grid w-320 grid-cols-1 gap-16 bg-muted-pressed p-16'>
      <div className='body-4-semi-bold text-muted'>Container: 320px wide</div>
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
    </div>
  ),
};
