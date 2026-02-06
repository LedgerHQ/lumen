import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  component: Stepper,
  title: 'Feedback/Stepper',
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
    disabled: { control: 'boolean' },
  },
};

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
        <span className='body-3 text-muted'>Unstarted (0/9)</span>
        <Stepper currentStep={0} totalSteps={9} />
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
