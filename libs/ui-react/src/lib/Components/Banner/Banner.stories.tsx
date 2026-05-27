import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
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
    primaryAction: {
      control: 'select',
      options: ['Button', 'None'],
      mapping: {
        Button: (
          <Button
            appearance='transparent'
            size='sm'
            onClick={() => console.log('Primary clicked')}
          >
            Primary
          </Button>
        ),
        None: undefined,
      },
    },
    secondaryAction: {
      control: 'select',
      options: ['Button', 'None'],
      mapping: {
        Button: (
          <Button
            appearance='no-background'
            size='sm'
            onClick={() => console.log('Secondary clicked')}
          >
            Secondary
          </Button>
        ),
        None: undefined,
      },
    },
    onClose: {
      control: 'select',
      options: ['With Close', 'None'],
      mapping: {
        'With Close': () => {
          console.log('Close clicked');
        },
        None: undefined,
      },
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
    // max-w-md container for visual presentation - not required for Banner component
    <div className='max-w-md'>
      <Banner {...args} />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Banner
  appearance="info"
  title="Information Banner"
  onClose={() => console.log('Closed')}
  closeAriaLabel="Close banner"
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
    <div className='max-w-md'>
      <Banner {...args} />
    </div>
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
    <div className='max-w-md'>
      <Banner {...args} />
    </div>
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
        onClick={() => console.log('Primary clicked')}
      >
        Primary
      </Button>
    )}
    secondaryAction={(
      <Button
        appearance="no-background"
        size="sm"
        onClick={() => console.log('Secondary clicked')}
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
        onClick={() => console.log('Primary clicked')}
      >
        Primary
      </Button>
    ),
    secondaryAction: (
      <Button
        appearance='no-background'
        size='sm'
        onClick={() => console.log('Secondary clicked')}
      >
        Secondary
      </Button>
    ),
    onClose: () => console.log('Closed'),
    closeAriaLabel: 'Close banner',
  },
  render: (args) => (
    <div className='max-w-md'>
      <Banner {...args} />
    </div>
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
        onClick={() => console.log('Primary clicked')}
      >
        Primary
      </Button>
    )}
    secondaryAction={(
      <Button
        appearance="no-background"
        size="sm"
        onClick={() => console.log('Secondary clicked')}
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
      // max-w-md container for visual presentation - not required for Banner component
      <div className='flex max-w-md flex-col gap-16 p-8'>
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
      </div>
    );
  },
};

export const ContentVariations: Story = {
  render: () => (
    // max-w-md container for visual presentation - not required for Banner component
    <div className='flex max-w-md flex-col gap-16 p-8'>
      <Banner title='Title Only' />
      <Banner description='Description only without title' />
      <Banner title='With Description' description='Additional details here.' />
      <Banner
        title='With Primary Action'
        primaryAction={
          <Button
            appearance='transparent'
            size='sm'
            onClick={() => console.log('Primary clicked')}
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
            appearance='transparent'
            size='sm'
            onClick={() => console.log('Primary clicked')}
          >
            Primary
          </Button>
        }
        secondaryAction={
          <Button
            appearance='no-background'
            size='sm'
            onClick={() => console.log('Secondary clicked')}
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
            onClick={() => console.log('Primary clicked')}
          >
            Primary
          </Button>
        }
        secondaryAction={
          <Button
            appearance='no-background'
            size='sm'
            onClick={() => console.log('Secondary clicked')}
          >
            Secondary
          </Button>
        }
        onClose={() => console.log('Closed')}
        closeAriaLabel='Close banner'
      />
    </div>
  ),
};

export const NaturalWidth: Story = {
  render: () => (
    <div className='space-y-4'>
      <p className='body-3 text-muted'>
        Banner without container constraints - takes full parent width:
      </p>
      <Banner
        title='Full Width Banner'
        description='This banner demonstrates natural width behavior - it fills the full width of its parent container.'
        primaryAction={
          <Button
            appearance='transparent'
            size='sm'
            onClick={() => console.log('Action clicked')}
          >
            Action
          </Button>
        }
        onClose={() => console.log('Closed')}
        closeAriaLabel='Close full width banner'
      />
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <div className='grid w-400 grid-cols-1 gap-16 bg-muted-pressed p-16'>
      <div className='body-4-semi-bold text-muted'>
        Container with a fixed width
      </div>
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
    </div>
  ),
};

export const InteractiveDismiss: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return <p>Banner dismissed</p>;

    return (
      <div className='max-w-md'>
        <Banner
          {...args}
          title='Click close to dismiss'
          onClose={() => setVisible(false)}
          closeAriaLabel='Dismiss interactive banner'
        />
      </div>
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
      <div className='max-w-md'>
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
              <Button appearance='transparent' size='sm' onClick={handleAccept}>
                Accept
              </Button>
            ) : undefined
          }
          secondaryAction={
            state === 'idle' ? (
              <Button
                appearance='no-background'
                size='sm'
                onClick={handleReject}
              >
                Reject
              </Button>
            ) : undefined
          }
          onClose={() => setState('idle')}
          closeAriaLabel='Reset banner state'
        />
      </div>
    );
  },
};
