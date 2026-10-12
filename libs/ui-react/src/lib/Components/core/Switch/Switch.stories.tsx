import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Switch } from './Switch';

const meta = {
  id: 'react-switch',
  title: 'Core/Switch',
  component: Switch,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    selected: { control: 'boolean' },
    defaultSelected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Base: Story = {
  args: {
    size: 'md',
    disabled: false,
  },
  render: (args) => <Switch aria-label='Toggle example' {...args} />,
};

export const StatesShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-32'>
      <Switch aria-label='Toggle' selected={false} />
      <Switch aria-label='Toggle' selected={true} />
      <Switch aria-label='Toggle' disabled />
      <Switch aria-label='Toggle' disabled selected={true} />
    </div>
  ),
};

export const SizesShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-32'>
      <Switch aria-label='Toggle' size='sm' />
      <Switch aria-label='Toggle' size='md' />
    </div>
  ),
};

export const WithForm: Story = {
  render: () => {
    const [submitted, setSubmitted] = useState<string>();

    return (
      <form
        className='flex flex-col gap-16 p-16 text-base'
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setSubmitted(JSON.stringify(Object.fromEntries(data)));
        }}
      >
        <div className='flex items-center gap-8'>
          <Switch id='notifications' name='notifications' defaultSelected />
          <label htmlFor='notifications' className='body-3'>
            Push notifications
          </label>
        </div>
        <div className='flex items-center gap-8'>
          <Switch id='newsletter' name='newsletter' value='weekly' />
          <label htmlFor='newsletter' className='body-3'>
            Weekly newsletter
          </label>
        </div>
        <div className='flex items-center gap-8'>
          <Switch id='terms' name='terms' required />
          <label htmlFor='terms' className='body-3'>
            I agree to the terms and conditions *
          </label>
        </div>
        <Button type='submit' size='sm' className='self-start'>
          Submit
        </Button>
        <output className='body-3 text-muted'>
          {submitted ?? 'Unselected switches are not submitted.'}
        </output>
      </form>
    );
  },
};
