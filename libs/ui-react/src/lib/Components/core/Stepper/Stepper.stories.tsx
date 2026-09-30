import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const meta = {
  component: Stepper,
  id: 'react-stepper',
  title: 'Core/Stepper',
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
    backgrounds: { default: 'light' },
  },
  argTypes: {
    currentStep: { control: 'number', min: 1 },
    totalSteps: { control: 'number', min: 1 },
    appearance: { control: 'select', options: ['accent', 'success'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Base: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
  parameters: {
    docs: {
      source: {
        code: `
<Stepper
  currentStep={2}
  totalSteps={4}
/>
`,
      },
    },
  },
};

export const AppearanceShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-32'>
      <div className='flex flex-col items-center gap-8'>
        <span className='body-3 text-muted'>Accent</span>
        <Stepper currentStep={2} totalSteps={4} appearance='accent' />
      </div>
      <div className='flex flex-col items-center gap-8'>
        <span className='body-3 text-muted'>Success</span>
        <Stepper currentStep={4} totalSteps={4} appearance='success' />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Stepper currentStep={2} totalSteps={4} appearance="accent" />
<Stepper currentStep={4} totalSteps={4} appearance="success" />
`,
      },
    },
  },
};

export const DisabledShowcase: Story = {
  render: () => (
    <div className='flex flex-col items-center gap-32'>
      <div className='flex flex-col items-center gap-8'>
        <span className='body-3 text-muted'>Default (2/4)</span>
        <Stepper currentStep={2} totalSteps={4} />
      </div>
      <div className='flex flex-col items-center gap-8'>
        <span className='body-3 text-muted'>Disabled (2/4)</span>
        <Stepper currentStep={2} totalSteps={4} disabled />
      </div>
      <div className='flex flex-col items-center gap-8'>
        <span className='body-3 text-muted'>Unstarted (0/8)</span>
        <Stepper currentStep={0} totalSteps={8} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Stepper currentStep={2} totalSteps={4} />
<Stepper currentStep={2} totalSteps={4} disabled />
<Stepper currentStep={0} totalSteps={9} />
`,
      },
    },
  },
};

export const WithCustomLabel: Story = {
  args: {
    currentStep: 5,
    totalSteps: 5,
    label: '🎉',
  },
  parameters: {
    docs: {
      source: {
        code: `
<Stepper
  currentStep={5}
  totalSteps={5}
  label="🎉"
/>
`,
      },
    },
  },
};
