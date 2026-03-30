import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Box, Text } from '../Utility';
import { Banner } from './Banner';

const meta: Meta<typeof Banner> = {
  component: Banner,
  title: 'Communication/Banner',
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
      options: ['info', 'success', 'warning', 'error'],
      description: 'The visual style appearance of the banner',
    },
    title: {
      control: 'text',
      description: 'The title of the banner',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
    primaryAction: {
      control: 'select',
      description: 'Primary action Button',
      options: ['Button', 'None'],
      mapping: {
        Button: (
          <Button
            appearance='transparent'
            size='sm'
            onPress={() => console.log('Primary clicked')}
          >
            Primary
          </Button>
        ),
        None: undefined,
      },
    },
    secondaryAction: {
      control: 'select',
      description: 'Secondary action Button',
      options: ['Button', 'None'],
      mapping: {
        Button: (
          <Button
            appearance='no-background'
            size='sm'
            onPress={() => console.log('Secondary clicked')}
          >
            Secondary
          </Button>
        ),
        None: undefined,
      },
    },
    onClose: {
      control: 'select',
      description: 'Close action Button',
      options: ['With Close', 'None'],
      mapping: {
        'With Close': () => {
          console.log('Close clicked');
        },
        None: undefined,
      },
    },
    closeAriaLabel: {
      control: 'text',
      description: 'Close action with onClick and ariaLabel',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Base: Story = {
  args: {
    appearance: 'info',
    title: 'Information Banner',
    primaryAction: 'None',
    secondaryAction: 'None',
  },
  render: (args) => (
    // maxWidth container for visual presentation - not required for Banner component
    <Box lx={{ maxWidth: 's400' }}>
      <Banner
        {...args}
        description={'This is additional information about the banner.'}
      />
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Banner
  appearance="info"
  title="Information Banner"
  onClose={() => console.log('Closed')}
  description="This is additional information about the banner."
/>
`,
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    appearance: 'info',
    title: 'Banner with Description',
    description: 'This is additional information about the banner.',
  },
  render: (args) => (
    <Box lx={{ maxWidth: 's400' }}>
      <Banner {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Banner
  appearance="info"
  title="Banner with Description"
  description="This is additional information about the banner."
  onClose={() => console.log('Closed')}
  closeAriaLabel="Close banner"
/>
`,
      },
    },
  },
};

export const WithActions: Story = {
  args: {
    appearance: 'info',
    title: 'Banner with Actions',
    primaryAction: 'Button',
    secondaryAction: 'Button',
  },
  render: (args) => (
    <Box lx={{ maxWidth: 's400' }}>
      <Banner {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
  <Banner
    appearance="info"
    title="Banner with Full Features"
    description="This is additional information about the banner."
    primaryAction={(
      <Button
        appearance="gray"
        size="sm"
        onPress={() => console.log('Primary clicked')}
      >
        Primary
      </Button>
    )}
    secondaryAction={(
      <Button
        appearance="no-background"
        size="sm"
        onPress={() => console.log('Secondary clicked')}
      >
        Secondary
      </Button>
    )}
    onClose={() => console.log('Closed')}
    closeAriaLabel="Close banner"
  />
  `,
      },
    },
  },
};

export const WithFullFeatures: Story = {
  args: {
    appearance: 'info',
    title: 'Banner with Full Features',
    description: 'This is additional information about the banner.',
    primaryAction: (
      <Button
        appearance='gray'
        size='sm'
        onPress={() => console.log('Primary clicked')}
      >
        Primary
      </Button>
    ),
    secondaryAction: (
      <Button
        appearance='no-background'
        size='sm'
        onPress={() => console.log('Secondary clicked')}
      >
        Secondary
      </Button>
    ),
    onClose: () => console.log('Closed'),
    closeAriaLabel: 'Close banner',
  },
  render: (args) => (
    <Box lx={{ maxWidth: 's400' }}>
      <Banner {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
  <Banner
    appearance="info"
    title="Banner with Full Features"
    description="This is additional information about the banner."
    primaryAction={(
      <Button
        appearance="gray"
        size="sm"
        onPress={() => console.log('Primary clicked')}
      >
        Primary
      </Button>
    )}
    secondaryAction={(
      <Button
        appearance="no-background"
        size="sm"
        onPress={() => console.log('Secondary clicked')}
      >
        Secondary
      </Button>
    )}
    onClose={() => console.log('Closed')}
    closeAriaLabel="Close banner"
  />
  `,
      },
    },
  },
};

export const AppearanceShowcase: Story = {
  render: () => {
    const appearances = [
      { name: 'Info', appearance: 'info' },
      { name: 'Success', appearance: 'success' },
      { name: 'Warning', appearance: 'warning' },
      { name: 'Error', appearance: 'error' },
    ] as const;

    return (
      // maxWidth container for visual presentation - not required for Banner component
      <Box
        lx={{
          flexDirection: 'column',
          maxWidth: 's400',
          gap: 's16',
          padding: 's8',
        }}
      >
        {appearances.map(({ name, appearance }) => (
          <Banner
            key={appearance}
            appearance={appearance}
            title={`${name} Banner`}
            description={`${name} Banner Description`}
            onClose={() => console.log('Closed')}
            closeAriaLabel={`Close ${name} banner`}
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
        maxWidth: 's400',
        gap: 's16',
        padding: 's8',
      }}
    >
      <Banner title='Title Only' />
      <Banner description='Description only without title' />
      <Banner title='With Description' description='Additional details here.' />
      <Banner
        title='With Primary Action'
        primaryAction={
          <Button
            appearance='gray'
            size='sm'
            onPress={() => console.log('Primary clicked')}
          >
            Primary
          </Button>
        }
      />
      <Banner
        title='With Close'
        description='Can be dismissed'
        onClose={() => console.log('Closed')}
        closeAriaLabel='Close banner'
      />
      <Banner
        title='With Actions and Description'
        description='Details'
        primaryAction={
          <Button
            appearance='gray'
            size='sm'
            onPress={() => console.log('Primary clicked')}
          >
            Primary
          </Button>
        }
        secondaryAction={
          <Button
            appearance='no-background'
            size='sm'
            onPress={() => console.log('Secondary clicked')}
          >
            Secondary
          </Button>
        }
      />
      <Banner
        appearance='info'
        title='Banner with Full Features'
        description='This is additional information about the banner.'
        primaryAction={
          <Button
            appearance='gray'
            size='sm'
            onPress={() => console.log('Primary clicked')}
          >
            Primary
          </Button>
        }
        secondaryAction={
          <Button
            appearance='no-background'
            size='sm'
            onPress={() => console.log('Secondary clicked')}
          >
            Secondary
          </Button>
        }
        onClose={() => console.log('Closed')}
        closeAriaLabel='Close banner'
      />
    </Box>
  ),
};

export const NaturalWidth: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Text typography='body3' lx={{ color: 'muted' }}>
        Banner without container constraints - takes full parent width:
      </Text>
      <Banner
        title='Full Width Banner'
        description='This banner demonstrates natural width behavior - it fills the full width of its parent container.'
        primaryAction={
          <Button
            appearance='transparent'
            size='sm'
            onPress={() => console.log('Action clicked')}
          >
            Action
          </Button>
        }
        onClose={() => console.log('Closed')}
        closeAriaLabel='Close full width banner'
      />
    </Box>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box
      lx={{
        width: 's400',
        flexDirection: 'column',
        gap: 's16',
        backgroundColor: 'mutedPressed',
        padding: 's16',
      }}
    >
      <Text typography='body4SemiBold' lx={{ color: 'muted' }}>
        Container with a fixed width
      </Text>
      <Banner
        title='Short Title'
        description='Short description'
        onClose={() => console.log('Closed')}
        closeAriaLabel='Close short banner'
      />
      <Banner
        title='Constrained Width'
        description='Banner width is controlled by a fixed width container'
        onClose={() => console.log('Closed')}
        closeAriaLabel='Close constrained width banner'
      />
      <Banner
        title='Longer Title That Might Overflow When Container is Smaller'
        description='This is a longer description that demonstrates how the banner handles longer content within its constraints. It should be truncated at 5 lines with an ellipsis, so this line should not be visible.'
        onClose={() => console.log('Closed')}
        closeAriaLabel='Close overflow banner'
      />
    </Box>
  ),
};

export const InteractiveDismiss: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return <Text typography='body2'>Banner dismissed</Text>;

    return (
      <Box lx={{ maxWidth: 's400' }}>
        <Banner
          {...args}
          title='Click close to dismiss'
          onClose={() => setVisible(false)}
          closeAriaLabel='Dismiss interactive banner'
        />
      </Box>
    );
  },
};

export const InteractiveActions: Story = {
  render: (args) => {
    const [state, setState] = useState('idle');

    const handleAccept = () => {
      setState('success');
    };

    const handleReject = () => {
      setState('error');
    };

    return (
      <Box lx={{ maxWidth: 's400' }}>
        <Banner
          {...args}
          appearance={
            state === 'success'
              ? 'success'
              : state === 'error'
                ? 'error'
                : 'info'
          }
          title={
            state === 'success'
              ? 'Accepted!'
              : state === 'error'
                ? 'Rejected!'
                : 'Banner with Action'
          }
          primaryAction={
            state === 'idle' ? (
              <Button appearance='transparent' size='sm' onPress={handleAccept}>
                Accept
              </Button>
            ) : undefined
          }
          secondaryAction={
            state === 'idle' ? (
              <Button
                appearance='no-background'
                size='sm'
                onPress={handleReject}
              >
                Reject
              </Button>
            ) : undefined
          }
          onClose={() => setState('idle')}
          closeAriaLabel='Reset banner state'
        />
      </Box>
    );
  },
};
